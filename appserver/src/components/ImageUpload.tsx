import { getCloudinaryConfig } from '@/lib/cloudinaryConfig'
import { useEffect, useState } from 'react'
import { Button } from './uiLib'
import log from '@/lib/log'

type UploadResult = {
  cloudinaryAssetId: string
  info: CldImageMetaPrivate
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
        // log.debug('cloudinary widget cb', error, result)
        if (!error && result && result.event === 'success') {
          log.debug('cloudinary result', result)
          /*
           * note: to get the image_metadata object, the "image metadata"
           * switch must be enabled for the upload preset under the "media
           * analysis and ai" category of settings for the preset.
           * it's important to NOT have any incoming transformations, because
           * those will remove the ability to obtain the original EXIF data
           * from camera image uploads.
          result.info = {
          {
            "id": "uw-file9",
            "batchId": "uw-batch8",
            "asset_id": "21ca891add0ab4ba7fb11c049c3d39f4",
            "public_id": "posts/niaqzg3bsfdhw2j0qwxn",
            "version": 1687817193,
            "version_id": "7ed1234ce6925f956cc34fadf3e22cbe",
            "signature": "2c96ad8ba98ea770231961214b53f4d9f91df570",
            "width": 1500,
            "height": 2000,
            "format": "jpg",
            "resource_type": "image",
            "created_at": "2023-06-26T22:06:33Z",
            "tags": [
              "post"
            ],
            "pages": 1,
            "bytes": 2139928,
            "type": "upload",
            "etag": "8a56fa3a9239d97eacd9a839f14c4e07",
            "placeholder": false,
            "url": "http://res.cloudinary.com/dbpulyvbq/image/upload/v1687817193/posts/niaqzg3bsfdhw2j0qwxn.jpg",
            "secure_url": "https://res.cloudinary.com/dbpulyvbq/image/upload/v1687817193/posts/niaqzg3bsfdhw2j0qwxn.jpg",
            "folder": "posts",
            "access_mode": "public",
            "image_metadata": {
              "Make": "Apple",
              "Model": "iPhone 12 mini",
              "Orientation": "Horizontal (normal)",
              "XResolution": "72",
              "YResolution": "72",
              "ResolutionUnit": "inches",
              "Software": "16.3.1",
              "ModifyDate": "2023:06:04 15:49:37",
              "HostComputer": "iPhone 12 mini",
              "TileWidth": "512",
              "TileLength": "512",
              "YCbCrPositioning": "Centered",
              "ExposureTime": "1/1366",
              "FNumber": "1.6",
              "ExposureProgram": "Program AE",
              "ISO": "32",
              "ExifVersion": "0232",
              "DateTimeOriginal": "2023:06:04 15:49:37",
              "CreateDate": "2023:06:04 15:49:37",
              "OffsetTime": "-07:00",
              "OffsetTimeOriginal": "-07:00",
              "OffsetTimeDigitized": "-07:00",
              "ComponentsConfiguration": "Y, Cb, Cr, -",
              "ShutterSpeedValue": "1/1366",
              "ApertureValue": "1.6",
              "BrightnessValue": "8.351612975",
              "ExposureCompensation": "0",
              "MeteringMode": "Multi-segment",
              "Flash": "Off, Did not fire",
              "FocalLength": "4.2 mm",
              "SubjectArea": "2009 1502 2208 1387",
              "SubSecTimeOriginal": "333",
              "SubSecTimeDigitized": "333",
              "FlashpixVersion": "0100",
              "ColorSpace": "Uncalibrated",
              "ExifImageWidth": "4032",
              "ExifImageHeight": "3024",
              "SensingMethod": "One-chip color area",
              "SceneType": "Directly photographed",
              "ExposureMode": "Auto",
              "WhiteBalance": "Auto",
              "FocalLengthIn35mmFormat": "26 mm",
              "SceneCaptureType": "Standard",
              "LensInfo": "1.549999952-4.2mm f/1.6-2.4",
              "LensMake": "Apple",
              "LensModel": "iPhone 12 mini back dual wide camera 4.2mm f/1.6",
              "CompositeImage": "General Composite Image",
              "JFIFVersion": "1.01",
              "ProfileDescription": "Display P3",
              "Colorspace": "RGB",
              "DPI": "72"
            },
            "illustration_score": 0,
            "semi_transparent": false,
            "grayscale": false,
            "original_filename": "IMG_5299",
            "original_extension": "jpeg",
            "path": "v1687817193/posts/niaqzg3bsfdhw2j0qwxn.jpg",
            "thumbnail_url": "https://res.cloudinary.com/dbpulyvbq/image/upload/c_limit,h_60,w_90/v1687817193/posts/niaqzg3bsfdhw2j0qwxn.jpg"
          }
          */
          onUploadWithUseCallback({
            cloudinaryAssetId: result.info.public_id,
            info: result.info,
          })
        }
        if (result && result.info === 'hidden') {
          setTimeout(() => {
            // this is insane. but cloudinary widget doesn't clean up properly.
            document.body.style.removeProperty('overflow')
          }, 100)
        }
      }
    ) as Widget
    setWidget(theWidget)
    return () => theWidget.destroy()
  }, [intent, onUploadWithUseCallback])

  return (
    <Button className={className} intent={required && !isReplace ? "primary" : "secondary"} onClick={launchWidget}>
      {isReplace ? "Replace" : "Upload image"}
    </Button>
  )
}

export default ImageUpload
