import { useStore } from '@/lib/store'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { Modal, Button } from './uiLib'

const DeletionConfirmationModal = observer(() => {
  const store = useStore()
  const handleClose = useCallback(() => {
    store.onDeleteResult('no')
  }, [store])
  // console.log("DeletionConfirmationModal",store.confirmingDelete)
  if (!store.confirmingDelete) {
    return <></>
  }
  const kind = store.confirmingDelete.kind
  return (
    <Modal
      isOpen={true}
      handleClose={handleClose}
      srTitle={`Are you sure your want to delete this ${kind}?`}
      renderTitleHeading
    >
      <p>This action cannot be undone.</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button
          spinning={store.confirmingDelete.deleting}
          intent="primary"
          onClick={() => store.onDeleteResult('yes')}
        >
          Delete
        </Button>
        <Button intent="secondary" onClick={() => store.onDeleteResult('no')}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
})

export default DeletionConfirmationModal
