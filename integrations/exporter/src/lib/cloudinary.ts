import { v2 as cloudinary } from 'cloudinary'
import { CliContext } from './types'

const getParseB64Json = (str: string | undefined) => {
  // console.log("debug str:",str)
  if (!str || !str.trim()) return false
  if (typeof window !== 'undefined') {
    // console.log("debug atob:",window.atob(str))
    return JSON.parse(window.atob(str))
  } else {
    // console.log("debug buffer decoded:",Buffer.from(str, 'base64').toString('utf8'))
    return JSON.parse(Buffer.from(str, 'base64').toString('utf8'))
  }
}

type CloudinarySecret = {
  cloud_name: string
  api_key: string
  api_secret: string
  upload_preset: string
}

export default async function init(context: CliContext) {
  const { config } = context
  const cloudinaryJsonSecretB64 = config.get('cloudinaryJsonSecretB64')

  const cloudinarySecret = getParseB64Json(cloudinaryJsonSecretB64) as
    | CloudinarySecret
    | false

  if (cloudinarySecret) {
    const cloudinaryConfig = {
      cloud_name: cloudinarySecret.cloud_name,
      api_key: cloudinarySecret.api_key,
      api_secret: cloudinarySecret.api_secret,
      upload_preset: 'linkpreview',
      secure: true,
    }
    cloudinary.config(cloudinaryConfig)
  }
}
