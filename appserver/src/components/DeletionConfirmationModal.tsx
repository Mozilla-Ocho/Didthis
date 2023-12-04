import { useStore } from '@/lib/store'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { Modal, Button } from './uiLib'

const DeletionConfirmationModal = observer(() => {
  const store = useStore()
  const handleClose = useCallback(() => {
    store.onDeleteResult('no')
  }, [store])
  const kind: string | undefined = store.confirmingDelete
    ? store.confirmingDelete.kind
    : undefined
  return (
    <Modal
      isOpen={store.showConfirmDeleteModal}
      handleClose={handleClose}
      srTitle={`Are you sure your want to delete this ${kind || ''}?`}
      renderTitleHeading
    >
      <p>This action cannot be undone.</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button intent="secondary" onClick={() => store.onDeleteResult('no')}>
          Cancel
        </Button>
        <Button
          spinning={
            store.confirmingDelete ? store.confirmingDelete.deleting : false
          }
          intent="primary"
          onClick={() => store.onDeleteResult('yes')}
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
})

export default DeletionConfirmationModal
