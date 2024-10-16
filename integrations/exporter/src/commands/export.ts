import { Storage, StorageOptions } from '@google-cloud/storage'
import archiver from 'archiver'
import axios from 'axios'
import { v2 as cloudinary } from 'cloudinary'
import { createReadStream, createWriteStream } from 'fs'
import * as fs from 'fs/promises'
import { tmpdir } from 'os'
import PQueue from 'p-queue'
import * as path from 'path'
import { Config } from '../lib/config'
import {
  ExportStatusInput,
  ExportStatusState,
} from '../lib/didthis-client/gql/graphql'
import initDidthisClient, { DidthisClient } from '../lib/didthis-client/index'
import { Logger } from '../lib/logging'
import { CliContext, ImageMetadata, Profile, User } from '../lib/types'
import templateIndex from '../templates/index'
import templateProject from '../templates/project'

export default async function init(context: CliContext) {
  const { config, log, program } = context
  program
    .command('export <userid>')
    .description('Export content')
    .option('--skip-clean', 'Skip cleaning the temporary directory')
    .option('--skip-profile-fetch', 'Skip fetching the user profile')
    .option('--skip-image-download', 'Skip downloading images')
    .option('--skip-upload', 'Skip uploading the export to the cloud')
    .option('--skip-update', 'Skip updating the export status')
    .option('--skip-zip', 'Skip creating the zip archive')
    .option('--render-only', 'Render the export site only')
    .action(async (userid, options) => {
      if (options.renderOnly) {
        Object.assign(options, {
          skipClean: true,
          skipProfile: true,
          skipImageDownload: true,
          skipUpdate: true,
          skipZip: true,
          skipUpload: true,
        })
      }
      const exporter = new Exporter({ config, log })
      await exporter.export(userid, options)
    })
}

export type ExporterOptions = {
  skipProfile?: boolean
  skipClean?: boolean
  skipImageDownload?: boolean
  skipUpdate?: boolean
  skipUpload?: boolean
  skipZip?: boolean
}

export class Exporter {
  config: Config
  log: Logger
  imageMetadata: Map<string, ImageMetadata>
  imageFetchQueue: PQueue
  userid?: string
  exportRootDir?: string
  didthisClient?: DidthisClient
  options?: ExporterOptions

  constructor({ config, log }: { config: Config; log: Logger }) {
    this.config = config
    this.log = log
    this.imageMetadata = new Map()
    this.imageFetchQueue = new PQueue({ concurrency: 16, autoStart: true })
  }

  async export(userid: string, options: ExporterOptions = {}) {
    this.options = options
    this.userid = userid
    this.log = this.log.child({ userid })

    const { log, config } = this
    log.info({ msg: 'export started', options })

    this.didthisClient = await initDidthisClient(this)
    this.imageFetchQueue.concurrency = config.get(
      'cloudinaryDownloadConcurrency'
    )
    this.exportRootDir = await this.prepareExportDirectory(userid, options)
    const user = await this.fetchUserProfile(userid)

    const { jobId } = user.profile.exportStatus || {}
    const initialStatus: ExportStatusInput = {
      jobId,
      state: ExportStatusState.Started,
      startedAt: new Date(),
      finishedAt: null,
      expiresAt: null,
      error: null,
      url: null,
    }
    await this.updateUserExportStatus(initialStatus)

    try {
      await this.downloadUserImages(user.profile)
      await this.renderExportSite(user)
      const archivePath = await this.createExportZipArchive()
      const exportUrl = await this.uploadExportToGcsBucket(archivePath)
      await this.updateUserExportStatus({
        ...initialStatus,
        state: ExportStatusState.Complete,
        finishedAt: new Date(),
        url: exportUrl,
      })
    } catch (err: any) {
      log.error({ msg: 'export failed', err })

      await this.updateUserExportStatus({
        ...initialStatus,
        state: ExportStatusState.Error,
        finishedAt: new Date(),
        error: err instanceof Error ? err.message : '' + err,
      })
    }
  }

  async updateUserExportStatus(status: ExportStatusInput) {
    if (this.options?.skipUpdate) return

    const { didthisClient, userid, log } = this
    if (!didthisClient || !userid) {
      throw new Error('exporter not initialized')
    }
    log.info({ msg: 'updating export status', status })
    return didthisClient.updateUserExportStatus(userid, status)
  }

  async prepareExportDirectory(
    userid: string,
    options: { skipClean?: boolean } = {}
  ) {
    const tmpPath = path.join(tmpdir(), 'didthis-exports', userid)
    !options.skipClean &&
      (await fs.rm(tmpPath, { recursive: true, force: true }))
    await fs.mkdir(tmpPath, { recursive: true })
    this.log.info({ msg: 'export directory', tmpPath })
    return tmpPath
  }

  async fetchUserProfile(userid: string) {
    if (this.options?.skipProfile) {
      const userPath = path.join(this.exportRootDir!, 'index.json')
      const userJson = await fs.readFile(userPath, 'utf8')
      return JSON.parse(userJson) as User
    }

    const { log } = this
    const user = await this.didthisClient!.fetchUserById({ id: userid })
    if (!user?.profile?.projects?.length) {
      throw new Error('failed to fetch user profile projects')
    }
    log.trace({ msg: 'fetched user', userid, user })
    return user
  }

  async downloadUserImages(profile: Profile) {
    const { log, imageFetchQueue } = this

    if (this.options?.skipImageDownload) {
      // Load image metadata from the existing export directory
      const imagesPath = path.join(this.exportRootDir!, 'images.json')
      const imagesJson = await fs.readFile(imagesPath, 'utf8')
      this.imageMetadata = new Map(Object.entries(JSON.parse(imagesJson)))
      return
    }

    // Iterate through the data to dig up all the images for download
    log.trace({ msg: 'enqueuing image fetches' })
    this.enqueueImageFetchByAssetId(profile?.imageAssetId)
    for (const project of profile?.projects || []) {
      this.enqueueImageFetchByAssetId(project?.imageAssetId)
      for (const update of project?.updates || []) {
        this.enqueueImageFetchByAssetId(update?.imageAssetId)
      }
    }

    log.debug({
      msg: 'image fetch queue status',
      size: imageFetchQueue.size,
      pending: imageFetchQueue.pending,
    })

    await imageFetchQueue.onIdle()

    const imagePaths = Array.from(this.imageMetadata.entries())

    log.info({
      msg: 'image fetch completed',
      imagePathsCount: imagePaths.length,
    })

    await this.renderResourceToFile('images.json', () =>
      JSON.stringify(Object.fromEntries(this.imageMetadata), null, 2)
    )

    log.trace({ msg: 'image fetch paths', imagePaths })
  }

  async enqueueImageFetchByAssetId(assetId?: string | null) {
    if (!assetId) return

    const { log, imageFetchQueue } = this

    return imageFetchQueue.add(async () => {
      log.trace({ msg: 'fetching image metadata', assetId })
      const result = await cloudinary.api.resources_by_ids([assetId])
      for (const rawMeta of result.resources) {
        const {
          secure_url: imageUrl,
          // Omit some useless fields from the metadata
          asset_id,
          public_id,
          url,
          access_mode,
          folder,
          // Preserve the rest for export
          ...meta
        } = rawMeta
        log.trace({ msg: 'fetched image metadata', meta, rawMeta })
        imageFetchQueue.add(async () =>
          this.fetchImage(assetId, imageUrl, meta)
        )
      }
    })
  }

  async fetchImage(
    assetId: string,
    imageUrl: string,
    meta: Omit<ImageMetadata, 'path'>
  ) {
    const { log, exportRootDir, imageMetadata } = this
    const { format } = meta

    const localImagePath = `images/${assetId}.${format}`
    const imagePath = path.join(exportRootDir!, localImagePath)
    await fs.mkdir(path.dirname(imagePath), { recursive: true })

    imageMetadata.set(assetId, { ...meta, path: localImagePath })

    log.debug({ msg: 'fetching image', imageUrl, imagePath })

    const response = await axios.get(imageUrl, {
      responseType: 'stream',
    })
    await new Promise((resolve, reject) => {
      const fileStream = createWriteStream(imagePath)
      response.data.pipe(fileStream)
      response.data.on('end', resolve)
      response.data.on('error', reject)
    })

    log.debug({ msg: 'fetched image', imageUrl, imagePath })
  }

  async renderExportSite(user: User) {
    const { config, log, imageFetchQueue, imageMetadata } = this
    const { profile } = user

    log.debug({ msg: 'rendering export site' })

    log.info({ msg: 'copying assets' })
    await fs.cp('./assets', path.join(this.exportRootDir!, 'assets'), {
      recursive: true,
    })

    await this.renderResourceToFile('index.json', () =>
      JSON.stringify(user, null, 2)
    )

    await this.renderResourceToFile(
      'index.html',
      templateIndex({ profile, imageMetadata })
    )

    for (const project of profile?.projects || []) {
      if (!project) continue
      await this.renderResourceToFile(
        `project-${project.id}.html`,
        templateProject({ project, profile, imageMetadata })
      )
    }

    log.info({ msg: 'rendered export site' })
  }

  async renderResourceToFile(localPath: string, templateContent: () => string) {
    const { exportRootDir } = this
    const filePath = path.join(exportRootDir!, localPath)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, templateContent())
  }

  async createExportZipArchive() {
    if (this.options?.skipZip) return null

    const { log, exportRootDir } = this

    const parentDir = path.dirname(exportRootDir!)
    const exportDirName = path.basename(exportRootDir!)
    const datestamp = new Date().toISOString().replace(/\D/g, '')
    const archiveName = `didthis-export-${exportDirName}-${datestamp}.zip`
    const archivePath = path.join(parentDir, archiveName)

    log.debug({ msg: 'creating archive', archivePath })

    await fs.rm(archivePath, { force: true })
    const archiveOutputStream = createWriteStream(archivePath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.pipe(archiveOutputStream)
    archive.directory(exportRootDir!, exportDirName)
    await archive.finalize()

    log.info({ msg: 'created archive', archivePath })

    return archivePath
  }

  async uploadExportToGcsBucket(
    archivePath: string | null
  ): Promise<string | null> {
    if (this.options?.skipUpload || !archivePath) return null
    const { log, config } = this

    const projectId = config.get('gcpProjectId')
    const keyfile = config.get('gcpKeyfile')
    const bucketName = config.get('gcpExportsStorageBucketName')

    const storageOptions: StorageOptions = {}
    if (projectId) storageOptions.projectId = projectId
    if (keyfile) storageOptions.keyFilename = keyfile

    const storage = new Storage(storageOptions)
    const bucket = storage.bucket(bucketName)

    const archiveFileName = path.basename(archivePath)
    const archiveStream = createReadStream(archivePath)
    const bucketFile = bucket.file(archiveFileName)
    const bucketStream = bucketFile.createWriteStream()

    log.debug({ msg: 'uploading archive', archiveFileName })

    await new Promise((resolve, reject) => {
      archiveStream.pipe(bucketStream)
      bucketStream.on('finish', resolve)
      bucketStream.on('error', reject)
    })

    const signedResult = await bucketFile.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 30 * 24 * 60 * 1000,
    })
    const signedDownloadUrl = signedResult[0]

    log.info({ msg: 'uploaded archive', signedDownloadUrl })

    return signedDownloadUrl
  }
}
