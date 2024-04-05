import { useStore } from '@/lib/store'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { Modal, Button } from './uiLib'
import { ConfirmingDelete } from '@/lib/store/store'

type ConfirmingDeleteKind = ConfirmingDelete["kind"]

const confirmingKindLabels: Record<ConfirmingDeleteKind, string> = {
  post: "update",
  account: "account",
  project: "project",
}

const DeletionConfirmationModal = observer(() => {
  const store = useStore()
  const handleClose = useCallback(() => {
    store.onDeleteResult('no')
  }, [store])
  const kind: ConfirmingDeleteKind | undefined = store.confirmingDelete
    ? store.confirmingDelete.kind
    : undefined
  const kindLabel = kind ? confirmingKindLabels[kind] : ''
  return (
    <Modal
      isOpen={store.showConfirmDeleteModal}
      handleClose={handleClose}
      srTitle={`Are you sure you want to delete this ${kindLabel}?`}
      renderTitleHeading
    >
      {kind === 'account' ? (
        <p className="max-w-[500px]">
          Deleting your account will truly and permanently remove all your data and
          projects. You will not be able to recover them, and neither will customer support!
        </p>
      ) : (
        <p>This action cannot be undone.</p>
      )}
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
