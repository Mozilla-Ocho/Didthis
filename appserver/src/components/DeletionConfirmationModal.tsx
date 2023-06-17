import { useStore } from '@/lib/store'
import { observer } from 'mobx-react-lite'
import { Modal, Button } from './uiLib'

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
      {store.confirmingDelete.deleting && <p>spinner...</p>}
      <Button intent="secondary" onClick={() => store.onDeleteResult('no')}>
        cancel
      </Button>
      <Button intent="primary" onClick={() => store.onDeleteResult('yes')}>
        delete
      </Button>
    </Modal>
  )
})

export default DeletionConfirmationModal
