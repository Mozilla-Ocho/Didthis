import { getCloudinaryConfig } from '@/lib/cloudinaryConfig'
import { useEffect, useState } from 'react'
import {Button} from './uiLib'

type UploadResult = {
  cloudinaryAssetId: string
  info: {
    public_id: string
    width: number
    height: number
    format: string
  }
}

type UploadCallback = (result: UploadResult) => void;

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
}: {
  intent: CldImageIntent
  onUploadWithUseCallback: (result: UploadResult) => void
}) => {
  const [widget,setWidget] = useState<Widget>()

  const launchWidget = () => {
    if (widget) widget.open()
  }

  useEffect(() => {
    const config = getCloudinaryConfig(intent)
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const win = window as any
    const theWidget = win.cloudinary.createUploadWidget(
      config,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log('cloudinary result', result)
          /*
            access_mode: "public"
            asset_id: "59f46bf2e26a92a480b8318f415e3002"
            batchId: "uw-batch2"
            bytes: 10094
            coordinates: Object { custom: (1) […] }
            created_at: "2023-06-15T20:11:48Z"
            etag: "510ea18761d3cfe897bc31504afaa368"
            folder: "prompts"
            format: "webp"
            height: 300
            id: "uw-file3"
            original_filename: "woodworking1"
            pages: 1
            path: "v1686859908/prompts/awr3ubc4s8exoctukv30.webp"
            placeholder: false
            public_id: "prompts/awr3ubc4s8exoctukv30"
            resource_type: "image"
            secure_url: "https://res.cloudinary.com/dbpulyvbq/image/upload/v1686859908/prompts/awr3ubc4s8exoctukv30.webp"
            signature: "9b14d012f1ddd8c576c4cc4dd0483ae31f18baac"
            tags: Array [ "prompts" ]
            thumbnail_url: "https://res.cloudinary.com/dbpulyvbq/image/upload/c_limit,h_60,w_90/v1686859908/prompts/awr3ubc4s8exoctukv30.jpg"
            type: "upload"
            url: "http://res.cloudinary.com/dbpulyvbq/image/upload/v1686859908/prompts/awr3ubc4s8exoctukv30.webp"
            version: 1686859908
            version_id: "a203dc8d7986a67c9140e1b2cec77244"
            width: 600
          */
          onUploadWithUseCallback({
            cloudinaryAssetId: result.info.public_id,
            info: result.info,
          })
        }
      }
    ) as Widget
    setWidget(theWidget)
    return () => theWidget.destroy()
  }, [intent, onUploadWithUseCallback])


  return <><Button intent="primary" onClick={launchWidget}>Choose Image</Button></>
}

export default ImageUpload
