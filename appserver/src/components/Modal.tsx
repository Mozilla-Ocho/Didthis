import React, { useRef, useEffect, ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
  isOpen: boolean
  handleClose: () => void
  title: string
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  handleClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // portal node creation must happen inside useeffect due to nextjs SSR
    const div = document.createElement('div')
    div.className = 'modal-root'
    elRef.current = div
    const modalRoot = document.body
    modalRoot.appendChild(elRef.current)
    return () => {
      modalRoot.removeChild(elRef.current as HTMLDivElement)
    }
  }, [])

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

  return isOpen
    ? ReactDOM.createPortal(
        <div
          className="fixed z-50 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              ref={modalRef}
            >
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    {title}
                  </h3>
                  <div className="mt-2">{children}</div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        elRef.current as HTMLDivElement
      )
    : null
}

export default Modal
