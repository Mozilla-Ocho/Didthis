// import classNames from 'classnames'
import React, { useEffect, ReactNode, useState, useRef } from 'react'
import ReactModal from 'react-modal'
import { twMerge } from 'tailwind-merge'
import { H } from '.'

const appRootDivId = 'approot' // exported, used in default layout

ReactModal.setAppElement('#' + appRootDivId)

// DRY_62447 modal transition time
const modalTransitionTime = 200

interface ModalProps {
  isOpen: boolean
  handleClose: () => void
  srTitle: string
  renderTitleHeading?: boolean
  noPad?: boolean
  maxEdge?: boolean
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  handleClose,
  srTitle,
  renderTitleHeading,
  noPad,
  maxEdge,
  children,
}) => {
  // see globals.css for ReactModal__Body--open (hides overflow to prevent document scroll)

  // TODO: for some reason, the shouldCloseOnOverlayClick is not working with
  // ReactModal. it's supposed to do this by default. i'm implementing my own
  // check for click events outside the modal here...
  const contentRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        contentRef &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          handleClose()
        }
      }
    }
    window.addEventListener('mousedown', handleOutsideClick)
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, handleClose])

  return (
    <ReactModal
      isOpen={isOpen}
      bodyOpenClassName="ReactModal__Body--open"
      onRequestClose={handleClose}
      contentLabel={srTitle}
      overlayClassName="fixed z-50 inset-0 top-0 right-0 left-0 bottom-0 bg-gray-800 bg-opacity-80 overflow-y-auto"
      className="absolute flex justify-center items-center min-h-screen w-screen"
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={modalTransitionTime}
    >
      <div
        ref={contentRef}
        className={twMerge(
          'modal_content_container overflow-hidden shadow-xl min-w-[320px]',
          maxEdge ? 'w-full' : 'm-4 bg-white rounded-lg',
          noPad || maxEdge ? '' : 'px-4 pt-5 pb-4 sm:p-6'
        )}
      >
        {renderTitleHeading && <H.H4 className={`m-0 mb-4`}>{srTitle}</H.H4>}
        {children}
      </div>
    </ReactModal>
  )
}

export default Modal

export { appRootDivId }
