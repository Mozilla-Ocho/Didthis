import { getCloudinaryTransform, cloudinaryUrlDirect } from '@/lib/cloudinaryConfig'
import { twMerge } from 'tailwind-merge'

const CloudinaryImage = ({
  assetId,
  imageMeta,
  intent,
  className,
}: {
  assetId: string | undefined | false
  imageMeta?: CldImageMetaAny
  intent: CldImageIntent
  className?: string
}) => {
  if (!assetId) {
    return <></>
  }
  // we force an aspect ratio using complicated tailwind plugin stuff so that
  // while the image loads, it 
  const aspect = ['aspect-h-1']
  if (intent === 'avatar' || intent === 'project') {
    aspect.push('aspect-w-1')
  } else if (intent === 'post') {
    aspect.pop()
  } else {
    aspect.push('aspect-w-2')
  }
  // leading-none fixes space after images
  /* eslint-disable @next/next/no-img-element */
  return (
    <span className="block w-full">
      <span
        className={twMerge(
          'leading-none block',
          aspect,
          intent !== 'avatar' && 'bg-black-100',
          intent === 'avatar' && '[&>img]:rounded-full',
          className
        )}
      >
        <img
          alt="user uploaded image"
          width={imageMeta?.width || null}
          height={imageMeta?.height || null}
          src={cloudinaryUrlDirect(assetId, intent, imageMeta)}
        />
      </span>
    </span>
  )
}

export default CloudinaryImage
