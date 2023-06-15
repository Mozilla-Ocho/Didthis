import { AdvancedImage, lazyload } from '@cloudinary/react'
import { getCloudinaryTransform } from '@/lib/cloudinaryConfig'

const CloudinaryImage = ({
  assetId,
  intent,
}: {
  assetId: string | undefined | false
  intent: CldImageIntent
}) => {
  if (!assetId) return <></>

  // leading-none fixes space after images
  return (
    <div className="leading-none inline-block">
      <AdvancedImage
        cldImg={getCloudinaryTransform(intent, assetId)}
        plugins={[lazyload()]}
      />
    </div>
  )
}

export default CloudinaryImage
