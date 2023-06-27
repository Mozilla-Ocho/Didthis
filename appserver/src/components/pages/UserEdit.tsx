import UserForm from '@/components/forms/User'
import { observer } from 'mobx-react-lite'
import Breadcrumbs from '../Breadcrumbs'
import {H, PagePad} from '../uiLib'

const UserEditPage = observer(() => {
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
