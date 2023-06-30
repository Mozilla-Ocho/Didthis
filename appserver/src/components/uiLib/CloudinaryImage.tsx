import { cloudinaryUrlDirect } from '@/lib/cloudinaryConfig'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Modal from './Modal'

const CloudinaryImage = ({
  assetId,
  imageMeta,
  intent,
  className,
  lightbox,
  linkTo,
  rounded,
}: {
  assetId: string | undefined | false
  imageMeta?: CldImageMetaAny
  intent: CldImageIntent
  className?: string
  lightbox?: boolean
  linkTo?: string,
  rounded?: boolean,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = useCallback(() => {
    if (lightbox) {
      setIsOpen(true)
    }
  }, [setIsOpen, lightbox])
  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])
  if (!assetId) {
    return <></>
  }
  // we force an aspect ratio using complicated tailwind plugin stuff so that
  // when the image loads it doesn't cause a reflow
  const aspect: string[] = []
  if (intent === 'avatar') {
    aspect.push('aspect-w-1', 'aspect-h-1')
  } else if (intent === 'project') {
    aspect.push('aspect-w-3', 'aspect-h-2')
  } else if (intent === 'post') {
  }
  // leading-none fixes space after images
  /* eslint-disable @next/next/no-img-element */

  const loadingBgColor = intent === 'post' ? 'bg-black-100' : ''

  const regularImageContent = (
    <>
      <span
        className={twMerge(
          'leading-none block text-black-300 [&>img]:text-center [&>img]:leading-10',
          aspect,
          loadingBgColor,
          intent === 'avatar' && '[&>img]:rounded-full',
          rounded ? '[&>img]:rounded-md' : '',
          className
        )}
      >
        <img
          alt="user-uploaded image"
          width={imageMeta?.width || null}
          height={imageMeta?.height || null}
          src={cloudinaryUrlDirect(assetId, intent, imageMeta)}
          onClick={handleClick}
        />
      </span>
    </>
  )

  const lightboxImageContent = (
    <>
      <div className="grid p-4 w-screen h-screen items-center justify-center">
        <div className="flex w-full h-full">
          <img
            alt="user uploaded image"
            src={cloudinaryUrlDirect(assetId, intent, imageMeta)}
            onClick={handleClose}
            className="object-contain w-full h-full cursor-pointer"
          />
        </div>
      </div>
    </>
  )

  if (lightbox) {
    return (
      <span className="block w-full cursor-pointer">
        <Modal
          isOpen={isOpen}
          handleClose={handleClose}
          srTitle="User uploaded image lightbox"
          maxEdge
        >
          {lightboxImageContent}
        </Modal>
        {regularImageContent}
      </span>
    )
  } else if (linkTo) {
    return <Link href={linkTo}><span className="block w-full">{regularImageContent}</span></Link>
  } else {
    return <span className="block w-full">{regularImageContent}</span>
  }
}

export default CloudinaryImage
