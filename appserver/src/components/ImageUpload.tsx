import { getCloudinaryConfig } from '@/lib/cloudinaryConfig'
import { useEffect, useState } from 'react'
import { Button } from './uiLib'

type UploadResult = {
  cloudinaryAssetId: string
  info: CldImageMetaAny
}

type UploadCallback = (result: UploadResult) => void

export type { UploadCallback }

type Widget = {
  open: () => void
  destroy: () => void
}

const ImageUpload = ({
  intent,
  // caller must useCallback for this, or it will destroy/recreate the widget
  // on re-renders due to it being a dependency in the useEffect here that
  // creates and destroys the widget.
  onUploadWithUseCallback,
  className,
  isReplace,
  required,
}: {
  intent: CldImageIntent
  onUploadWithUseCallback: (result: UploadResult) => void
  className?: string,
  isReplace?: boolean,
  required?: boolean,
}) => {
  const [widget, setWidget] = useState<Widget>()
  const [, setRerenderDummyFn] = useState(0)

  const launchWidget = () => {
    if (widget) widget.open()
  }

  useEffect(() => {
    const config = getCloudinaryConfig(intent)
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const win = window as any
    if (!win.cloudinary) {
      // window global cloudinary lib might not be loaded yet. is there a
      // better way to retrigger useEffect after a timeout?
      setTimeout(() => setRerenderDummyFn(new Date().getTime()), 20)
      return
    }
    const theWidget = win.cloudinary.createUploadWidget(
      config,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log('cloudinary result', result)
          /*
           * note: to get the image_metadata object, the "image metadata"
           * switch must be enabled for the upload preset under the "media
           * analysis and ai" category of settings for the preset.
          result.info = {
            "id": "uw-file3",
            "batchId": "uw-batch2",
            "asset_id": "5d63c1b08ef2995e9907e6b826190c82",
            "public_id": "prompts/iih1rfvcuuvq5fvr1pzv",
            "version": 1686869157,
            "version_id": "77203245d0f3e5f541a23ec48e97c296",
            "signature": "592a9bea1ebe44486fcc649afca9870a1bd87511",
            "width": 1500,
            "height": 750,
            "format": "jpg",
            "resource_type": "image",
            "created_at": "2023-06-15T22:45:57Z",
            "tags": [
              "project"
            ],
            "pages": 1,
            "bytes": 510217,
            "type": "upload",
            "etag": "2c3b7d5cfb419d81ff6e4a728bd203c3",
            "placeholder": false,
            "url": "http://res.cloudinary.com/dbpulyvbq/image/upload/v1686869157/prompts/iih1rfvcuuvq5fvr1pzv.jpg",
            "secure_url": "https://res.cloudinary.com/dbpulyvbq/image/upload/v1686869157/prompts/iih1rfvcuuvq5fvr1pzv.jpg",
            "folder": "prompts",
            "access_mode": "public",
            "image_metadata": {
              "JFIFVersion": "1.01",
              "ResolutionUnit": "None",
              "XResolution": "1",
              "YResolution": "1",
              "ProfileDescription": "Display P3",
              "Colorspace": "RGB",
              "DPI": "0"
            },
            "coordinates": {
              "custom": [
                [
                  0,
                  0,
                  1500,
                  750
                ]
              ]
            },
            "illustration_score": 0,
            "semi_transparent": false,
            "grayscale": false,
            "original_filename": "IMG_5299",
            "original_extension": "jpeg",
            "path": "v1686869157/prompts/iih1rfvcuuvq5fvr1pzv.jpg",
            "thumbnail_url": "https://res.cloudinary.com/dbpulyvbq/image/upload/c_limit,h_60,w_90/v1686869157/prompts/iih1rfvcuuvq5fvr1pzv.jpg"
          }
          */
          onUploadWithUseCallback({
            cloudinaryAssetId: result.info.public_id,
            info: result.info,
          })
        }
        setTimeout(() => {
          // this is insane. but cloudinary widget doesn't clean up properly.
          document.body.style.overflow = 'auto'
        }, 100)
      }
    ) as Widget
    setWidget(theWidget)
    return () => theWidget.destroy()
  }, [intent, onUploadWithUseCallback])

  return (
    <Button className={className} intent={required && !isReplace ? "primary" : "secondary"} onClick={launchWidget}>
      {isReplace ? "Replace image" : "Upload image"}
    </Button>
  )
}

export default ImageUpload
