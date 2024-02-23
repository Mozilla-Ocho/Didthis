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
  closeX?: boolean
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
  closeX,
}) => {
  // when there's only one button, we want full width button regardless of
  // mobile vs desktop layout. however, if there are 2 buttons, in mobile we
  // want the stacked (full width) and in desktop we want them side by side.
  // so if 2 buttons exist, assign a sm: breakpoint for non-mobile devices to
  // set 2 cols.  (remember "sm" is the first non-mobile layout breakpoint.)
  const numConfButtons = (yesText ? 1 : 0) + (noText ? 1 : 0)
  const webGridCols = numConfButtons > 1 ? 'sm:grid-cols-2' : ''
  return (
    <Modal srTitle={title} fixedSmall renderTitleHeading isOpen={isOpen} handleClose={onClose} closeX={closeX}>
      <div>
        {body && <p id="confirm-modal-body" className="mb-4">{body}</p>}
        {!body && (
          <div id="confirm-modal-body" style={{ marginBottom: '16px' }}>
            {children}
          </div>
        )}
        <div className={"grid grid-cols-1 gap-4 "+webGridCols}>
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
