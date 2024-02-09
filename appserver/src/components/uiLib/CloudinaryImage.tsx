import { cloudinaryUrlDirect } from '@/lib/cloudinaryConfig'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '.'
import Modal from './Modal'

const CloudinaryImage = ({
  assetId,
  imageMeta,
  intent,
  className,
  lightbox,
  linkTo,
  rounded,
  isProjectCard,
  fullW,
  photoPaperEdge,
}: {
  assetId: string | undefined | false
  imageMeta?: CldImageMetaAny
  intent: CldImageIntent
  className?: string
  lightbox?: boolean
  linkTo?: string
  rounded?: boolean
  isProjectCard?: boolean
  fullW?: boolean
  photoPaperEdge: boolean,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const store = useStore()
  const handleClick = useCallback(() => {
    if (lightbox) {
      store.trackEvent(trackingEvents.caLightbox, { imgIntent: intent })
      setIsOpen(true)
    }
  }, [setIsOpen, lightbox, store, intent])
  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])
  if (!assetId) {
    return <></>
  }
  // DRY_64132 cropping and aspect ratios
  const aspect: string[] = []
  if (isProjectCard) {
    aspect.push('aspect-w-3', 'aspect-h-2', '[&>img]:object-cover')
  } else if (intent === 'avatar') {
    aspect.push('aspect-w-1', 'aspect-h-1')
  } else if (intent === 'project') {
  } else if (intent === 'post') {
  }
  // leading-none fixes space after images
  /* eslint-disable @next/next/no-img-element */

  const loadingBgColor = intent === 'post' ? 'bg-black-100' : ''

  const photoPaperEdgeClasses = photoPaperEdge ? 'border-2 border-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' : ''

  const regularImageContent = (
    <>
      <span
        className={twMerge(
          'leading-none block text-black-300 [&>img]:text-center [&>img]:leading-10',
          aspect,
          loadingBgColor,
          photoPaperEdgeClasses,
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
          style={fullW ? {width:'100%'} : {}}
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
          <Button
            className="absolute top-2 right-4 leading-none text-black-100 no-underline text-4xl drop-shadow-[0_0px_3px_rgba(0,0,0,1)] hover:text-white"
            intent="link"
            aria-label="close"
            onClick={handleClose}
          >
            &#x2715;
          </Button>
          {lightboxImageContent}
        </Modal>
        {regularImageContent}
      </span>
    )
  } else if (linkTo) {
    return (
      <Link href={linkTo}>
        <span className="block w-full">{regularImageContent}</span>
      </Link>
    )
  } else {
    return <span className="block w-full">{regularImageContent}</span>
  }
}

export default CloudinaryImage
