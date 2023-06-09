import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { Divider, Link } from './uiLib'
import pathBuilder from '@/lib/pathBuidler'

// XXX_SKELETON
const UserPreview = observer(({ user }: { user: ApiUser }) => {
  const store = useStore()
  const isSelf = store.user && store.user.id === user.id
  return (
    <div>
      <Link href={pathBuilder.user(user.urlSlug)}>
        {user.fullName || user.urlSlug}
      </Link>
      {isSelf && '(clickable edit link here)'}
      <Divider />
    </div>
  )
})

export default UserPreview
