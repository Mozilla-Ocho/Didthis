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
  spinning?: boolean
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
  spinning,
}) => {
  return (
    <Modal srTitle={title} fixedSmall renderTitleHeading isOpen={isOpen} handleClose={onClose}>
      <div>
        {body && <p id="confirm-modal-body" className="mb-4">{body}</p>}
        {!body && (
          <div id="confirm-modal-body" style={{ marginBottom: '16px' }}>
            {children}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          {noText && (
            <Button intent="secondary" onClick={onNo}>
              {noText}
            </Button>
          )}
          {yesText && (
            <Button intent="primary" onClick={onYes} spinning={spinning}>
              {yesText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
