import { getCloudinaryConfig } from '@/lib/cloudinaryConfig'
import { useEffect, useState } from 'react'
import { Button } from './uiLib'
import log from '@/lib/log'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { twMerge } from 'tailwind-merge'
import useAppShell from '@/lib/appShellContent'

type UploadResult = {
  cloudinaryAssetId: string
  imageMetaPrivate: CldImageMetaPrivate
}

type UploadCallback = (result: UploadResult) => void

export type { UploadCallback }

const ImageUploadAppShell = ({
  intent,
  onUploadWithUseCallback,
  className,
  isReplace,
  required,
}: {
  intent: CldImageIntent
  onUploadWithUseCallback: (result: UploadResult) => void
  className?: string
  isReplace?: boolean
  required?: boolean
}) => {
  const appShell = useAppShell()
  const store = useStore()

  const handlePickImage = async () => {
    const result = await appShell.api.request('pickImage', { intent: 'post' })
    // TODO: report an error here?
    if (!result || 'cancelled' in result) return
    store.trackEvent(trackingEvents.caUploadImage, { imgIntent: intent })
    onUploadWithUseCallback({
      cloudinaryAssetId: result.public_id,
      imageMetaPrivate: {
        ...result,
        image_metadata: {
          ...result.image_metadata,
          // HACK: result.exif is from native OS and seems to have more
          // reliable data than cloudinary's response
          ...result.exif,
        },
        metaOrigin: 'private',
      } as CldImageMetaPrivate,
    })
  }

  return (
    <Button
      className={twMerge('leading-tight', className)}
      intent={required && !isReplace ? 'primary' : 'secondary'}
      onClick={handlePickImage}
    >
      {isReplace ? 'Replace image' : 'Upload image'}
    </Button>
  )
}

export default ImageUploadAppShell
