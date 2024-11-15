import dayjs from 'dayjs'

const specialAssetIds = {
  // these have been manually uploaded to cloudinary and we are using the
  // images in the app via these ID constants.
  // TODO: can we mark these as undeletable somehow in cloudinary?
  mockAvatarID: 'cypress-avatar-dont-delete',
  defaultAvatarID: 'avatars/default_avatar_ollijf',
  placholderProjectID: 'projects/owj4cttaiwevemryev8x',
}

const getCloudinaryConfig = (intent: CldImageIntent) => {
  //https://cloudinary.com/documentation/upload_widget_reference
  const base = {
    // DRY_02888 cloudinary cloud name
    cloudName: 'dbpulyvbq',
    sources: ['local'],
    multiple: false,
    maxFileSize: 15000000,
    maxImageFileSize: 15000000,
    // DRY_64132 cropping and aspect ratios
    cropping: false,
    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    maxImageWidth: 3000,
    maxImageHeight: 3000,
    theme: 'minimal',
    showPoweredBy: false,
    text: {
      en: {
        crop: {
          skip_btn: 'Skip Crop',
        },
        queue: {
          title_uploading_with_counter: 'Uploading {{num}} images',
          title_uploading: 'Uploading images',
        },
        local: {
          dd_title_single: 'Drag and drop an image here',
          dd_title_multi: 'Drag and drop images here',
          drop_title_single: 'Drop an image to upload',
          drop_title_multiple: 'Drop images to upload',
        },
        url: {
          inner_title: 'Public URL of image to upload',
        },
      },
    },
  }
  if (intent === 'avatar') {
    return {
      ...base,
      tags: ['avatar'],
      uploadPreset: 'avatar_uploads',
    }
  }
  if (intent === 'post') {
    const x = {
      ...base,
      tags: ['post'],
      uploadPreset: 'obyw5ywa',
      folder: 'posts',
    }
    return x
  }
  if (intent === 'project') {
    const x = {
      ...base,
      tags: ['project'],
      uploadPreset: 'wuty6ww4',
      folder: 'projects',
    }
    return x
  }
  throw new Error('invalid component for cloudinary config')
}

const cloudinaryUrlDirect = (
  assetId: string,
  intent: CldImageIntent,
  imageMeta?: CldImageMetaAny
) => {
  /* the cloudianry url-gen library is, as far as i can tell, undocumented with
   * the exception of a few examples that have miniscule coverage of the
   * available transformations and no real reference docs. i also cant even
   * find the source code online to inpect it, as the url-gen library is just a
   * layer on top of another dependency that has the actual logic and that
   * library produces a 404 on github... i need to actually control the
   * transformations and be able to reason about what i'm doing, i am writing
   * this simple string code myself. i can't actually figure out how to get
   * c_limit,h_NNN,w_NNN out of the url-gen library from any docs... */
  const config = getCloudinaryConfig(intent)
  // DRY_64132 cropping and aspect ratios
  // for avatars, we ask for a cropped image from cloudinary set to a square
  // aspect ratio, with the gravity set to face detection.
  const aspectRatioTransform = intent === "avatar" ? "/c_fill,ar_1,g_face" : "";
  // note the assetId already contains the folder path
  const url = `https://res.cloudinary.com/${config.cloudName}/image/upload/c_limit,h_2000,w_2000,f_jpg,q_auto${aspectRatioTransform}/v1/${assetId}`
  return url
}

const makeDashesInDatePart = (str: string): string => {
  const [date,time] = str.split(' ')
  return date.replaceAll(':','-')+' '+time
}

const getExifCreatedAtMillis = (imageMeta: CldImageMetaAny): number | null => {
  if (imageMeta && imageMeta.metaOrigin === 'private') {
    if (imageMeta.image_metadata) {
      let timeStr = ''
      let offsetStr = ''
      const exif = imageMeta.image_metadata
      if (exif) {
        // looks like YYYY:MM:DD HH:MM:SS
        timeStr =
          exif.DateTime ||
          exif.DateTimeOriginal ||
          exif.DateTimeDigitized ||
          exif.CreateDate ||
          exif.ModifyDate || ""
        // looks like [+/-]NN:NN eg "-07:00"
        offsetStr =
          exif.OffsetTime || exif.OffsetTimeOriginal || exif.OffsetTimeDigitized || ""
      }
      if (timeStr) {
        try {
          // try to make the exif strings into an iso date w/ offset
          const d = dayjs(makeDashesInDatePart(timeStr) + offsetStr)
          return d.valueOf()
        } catch (e) {
          return null
        }
      }
    }
  }
  return null
}

export {
  getCloudinaryConfig,
  specialAssetIds,
  cloudinaryUrlDirect,
  getExifCreatedAtMillis,
}
