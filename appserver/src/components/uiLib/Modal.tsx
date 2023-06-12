import classNames from 'classnames'
import React, { useRef, useEffect, ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
  id: string,
  isOpen: boolean
  handleClose: () => void
  title: string
  hideTitle?: boolean
  noPad?: boolean
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({
  id,
  isOpen,
  handleClose,
  title,
  hideTitle,
  noPad,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // portal node creation must happen inside useeffect due to nextjs SSR
    const div = document.createElement('div')
    div.className = `modal-root-${id}`
    div.id = id
    elRef.current = div
    const modalRoot = document.body
    modalRoot.appendChild(elRef.current)
    return () => {
      modalRoot.removeChild(elRef.current as HTMLDivElement)
    }
  }, [id])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          handleClose()
        }
      }
    }

    function handleEscapeKeydown(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleEscapeKeydown)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleEscapeKeydown)
    }
  }, [isOpen, handleClose])

  return isOpen && elRef.current
    ? ReactDOM.createPortal(
        <div
          className="fixed z-50 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className={`absolute grid min-h-screen w-screen`}>
            <div
              className="bg-gray-500 bg-opacity-75 min-h-screen min-y-screen"
              aria-hidden="true"
            ></div>
          </div>
            <div className="absolute flex justify-center items-center min-h-screen w-screen">
              <div
                className={classNames(
                  'bg-white rounded-lg overflow-hidden shadow-xl min-w-[320px]',
                  noPad ? '' : 'px-4 pt-5 pb-4 sm:p-6'
                )}
                ref={modalRef}
              >
                <div>
                  <h3
                    className={`text-lg leading-6 font-medium text-gray-900 ${
                      hideTitle ? 'hidden' : ''
                    }`}
                    id="modal-title"
                  >
                    {title}
                  </h3>
                  <div>{children}</div>
                </div>
              </div>
          </div>
        </div>,
        elRef.current as HTMLDivElement
      )
    : null
}

export default Modal
