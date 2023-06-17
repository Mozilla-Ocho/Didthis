import UserPreview from '../UserPreview'
import NotFound from './NotFound'
import UserProjects from './UserProjects'

const UnauthUser = ({ targetUser }: { targetUser: ApiUser | false }) => {
  if (!targetUser) return <NotFound />
  return (
    <>
      <UserPreview user={targetUser} />
      <UserProjects targetUser={targetUser} />
    </>
  )
}

export default UnauthUser
