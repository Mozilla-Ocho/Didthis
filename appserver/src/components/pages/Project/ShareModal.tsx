import { Button, Modal, Input } from '@/components/uiLib'

const ShareModal = ({
  isOpen,
  handleClose,
  url,
}: {
  isOpen: boolean
  handleClose: VoidFunction
  url: string
}) => {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }
  return (
    <Modal
      isOpen={isOpen}
      srTitle="Link copied"
      renderTitleHeading
      handleClose={handleClose}
    >
      <p>The link for this project has been copied to the clipboard.</p>
      <Input
        type="text"
        value={url}
        onFocus={handleFocus}
        onChange={() => null}
        className="my-2"
      />
      <div className="grid grid-cols-1 mt-8">
        <Button intent="primary" onClick={handleClose}>
          OK
        </Button>
      </div>
    </Modal>
  )
}

export default ShareModal
