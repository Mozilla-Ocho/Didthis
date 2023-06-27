import UserForm from '@/components/forms/User'
import { observer } from 'mobx-react-lite'
import Breadcrumbs from '../Breadcrumbs'
import {H} from '../uiLib'

const UserEditPage = observer(() => {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: 'Account details' }]} />
      <UserForm />
    </>
  )
})

export default UserEditPage
