import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { Link } from './uiLib'
import pathBuilder from '@/lib/pathBuidler'

const UserPreview = observer(({ user }: { user: ApiUser }) => {
  const store = useStore()
  const isSelf = store.user && store.user.id === user.id
  return (
    <div className="grid gap-4 py-4 grid-cols-[auto_auto_1fr]">
      <div>((avatar))</div>
      <Link href={pathBuilder.user(user.publicPageSlug)}>
        {user.profile.name || 'Unnamed user'}
      </Link>
      <div className="text-right">
        {isSelf && <Link href={pathBuilder.userEdit(user.systemSlug)}>edit</Link>}
      </div>
    </div>
  )
})

export default UserPreview
