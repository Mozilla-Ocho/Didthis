import UserForm from '@/components/forms/User'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { observer } from 'mobx-react-lite'
import Breadcrumbs from '../Breadcrumbs'
import { PagePad } from '../uiLib'

const UserEditPage = observer(() => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvEditAccount)
  return (
    <>
      <Breadcrumbs crumbs={[{ name: 'Account details' }]} />
      <PagePad>
        <UserForm />
      </PagePad>
    </>
  )
})

export default UserEditPage
