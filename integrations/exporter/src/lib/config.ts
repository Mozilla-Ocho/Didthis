import * as dotenv from 'dotenv'
import convict from 'convict'
import { configSchema as loggingConfigSchema } from './logging'

export default async function loadConfig() {
  dotenv.config()
  const config = convict({
    ...loggingConfigSchema,
    didthisApiUrl: {
      doc: 'Didthis GraphQL API URL',
      env: 'EXPORTER_DIDTHIS_API_URL',
      default: 'https://didthis.app/api/graphql',
    },
    didthisApiToken: {
      doc: 'Didthis GraphQL access token',
      env: 'EXPORTER_GRAPHQL_ACCESS_TOKEN',
      format: String,
      default: '',
      nullable: false,
      sensitive: true,
    },
    gcpProjectId: {
      doc: 'GCP project ID',
      env: 'GCP_PROJECT_ID',
      format: String,
      default: '',
      nullable: true,
    },
    gcpKeyfile: {
      doc: 'GCP keyfile path - mainly for local dev since credentials are provided by GCP in staging & production',
      env: 'GCP_KEYFILE',
      format: String,
      default: '',
      nullable: true,
    },
    gcpExportsStorageBucketName: {
      doc: 'GCP storage bucket name for exports',
      env: 'GCP_EXPORTS_STORAGE_BUCKET_NAME',
      format: String,
      default: '',
      nullable: true,
    },
    gcpExportsStorageBucketLocation: {
      doc: 'GCP storage bucket location for exports',
      env: 'GCP_EXPORTS_STORAGE_BUCKET_LOCATION',
      format: String,
      default: '',
      nullable: true,
    },
    cloudinaryJsonSecretB64: {
      doc: 'Cloudinary JSON secret as base64',
      env: 'CLOUDINARY_JSON_SECRET_B64',
      format: String,
      default: '',
      nullable: true,
      sensitive: true,
    },
    cloudinaryDownloadConcurrency: {
      doc: 'Cloudinary download concurrency',
      env: 'CLOUDINARY_DOWNLOAD_CONCURRENCY',
      format: 'int',
      default: 16,
    }
  })
  config.validate()
  return config
}

export type Config = Awaited<ReturnType<typeof loadConfig>>
