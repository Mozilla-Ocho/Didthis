import { useStore } from '@/lib/store'
import { observer } from 'mobx-react-lite'
import { Modal, Button } from './uiLib'
import Spinner from './uiLib/Spinner'

const DeletionConfirmationModal = observer(() => {
  const store = useStore()
  // console.log("DeletionConfirmationModal",store.confirmingDelete)
  if (!store.confirmingDelete) {
    return <></>
  }
  const kind = store.confirmingDelete.kind
  return (
    <Modal
      id="confirmDelete"
      isOpen={true}
      handleClose={() => store.onDeleteResult('no')}
      title={`Are you sure your want to delete this ${kind}?`}
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
