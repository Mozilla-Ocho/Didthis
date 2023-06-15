import { Cloudinary } from '@cloudinary/url-gen'
import { scale } from '@cloudinary/url-gen/actions/resize'
// import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const specialAssetIds = {
  // these have been manually uploaded to cloudinary and we are using the
  // images in the app via these ID constants.
  // TODO: can we mark these as undeletable somehow in cloudinary?
  mockAvatarID: 'cypress-avatar-dont-delete',
  defaultAvatarID: 'avatars/default_avatar_ollijf.svg',
}

const getCloudinaryConfig = (intent: CldImageIntent) => {
  //https://cloudinary.com/documentation/upload_widget_reference
  const base = {
    // DRY_02888 cloudinary cloud name
    cloudName: 'dbpulyvbq',
    sources: ['local', 'url', 'camera'],
    multiple: false,
    cropping: true,
    croppingAspectRatio: 1,
    croppingCoordinatesMode: 'custom',
    // we force the crop, and, we also have configured the upload preset to do
    // an incoming transformation of the image to crop it to the user's crop
    // region. that means the actual image stored is pre-cropped and we dont
    // need to do any special transformation or gravity on it when rendering.
    showSkipCropButton: false,
    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    maxImageFileSize: 5500000, //5.5MB
    maxImageWidth: 2000,
    maxImageHeight: 2000,
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
      folder: 'avatars',
    }
  }
  if (intent === 'post') {
    // XXX TODO: this is graceland stuff
    const x = {
      ...base,
      tags: ['prompts'],
      croppingAspectRatio: 2,
      uploadPreset: 'prompter_uploads',
      folder: 'prompts',
    }
    return x
  }
  throw new Error('invalid component for cloudinary config')
}

const getCloudinaryTransform = (
  intent: CldImageIntent,
  assetId: string,
  height?: 'original' | number
) => {
  const cloudConfig = getCloudinaryConfig(intent)
  const cld = new Cloudinary({
    cloud: {
      cloudName: cloudConfig.cloudName,
    },
  })
  if (height === 'original') {
    return cld.image(assetId)
  }
  if (typeof height === 'undefined') height = 500
  return cld.image(assetId).resize(scale().height(height || 500))
}

export { getCloudinaryConfig, getCloudinaryTransform, specialAssetIds }
