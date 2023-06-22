import { AdvancedImage, lazyload } from '@cloudinary/react'
import { getCloudinaryTransform } from '@/lib/cloudinaryConfig'
import { twMerge } from 'tailwind-merge'

const CloudinaryImage = ({
  assetId,
  intent,
  className,
}: {
  assetId: string | undefined | false
  intent: CldImageIntent
  className?: string
}) => {
  if (!assetId) {
    return <></>
  }
  // we force an aspect ratio using complicated tailwind plugin stuff so that
  // while the image loads, it 
  const aspect = ['aspect-h-1']
  if (intent === 'avatar') {
    aspect.push('aspect-w-1')
  } else {
    aspect.push('aspect-w-2')
  }
  // leading-none fixes space after images
  return (
    <span className="block max-w-md">
      <span
        className={twMerge(
          'leading-none block',
          aspect,
          intent !== 'avatar' && 'bg-black-100',
          intent === 'avatar' && '[&>img]:rounded-full',
          className
        )}
      >
        <AdvancedImage
          cldImg={getCloudinaryTransform(intent, assetId)}
          plugins={[lazyload()]}
        />
      </span>
    </span>
  )
}

export default CloudinaryImage
