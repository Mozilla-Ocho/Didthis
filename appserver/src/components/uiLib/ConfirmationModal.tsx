import { ReactNode } from 'react'
import Modal from './Modal'
import Button from './Button'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  body?: string
  children?: ReactNode
  yesText?: string
  noText?: string
  onYes?: () => void
  onNo?: () => void
  onClose: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  body,
  children,
  yesText,
  noText,
  onYes,
  onNo,
  onClose,
}) => {
  return (
    <Modal srTitle={title} renderTitleHeading isOpen={isOpen} handleClose={onClose}>
      <div className="max-w-[320px]">
        {body && <p id="confirm-modal-body">{body}</p>}
        {!body && (
          <div id="confirm-modal-body" style={{ marginBottom: '16px' }}>
            {children}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          {yesText && (
            <Button intent="primary" onClick={onYes}>
              {yesText}
            </Button>
          )}
          {noText && (
            <Button intent="secondary" onClick={onNo}>
              {noText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
