import { observer } from 'mobx-react-lite'
import { H } from '@/components/uiLib'
import ProjectList from '../ProjectList'

const UserProjects = observer(({ targetUser }: { targetUser: ApiUser }) => {
  return (
    <>
      <div>
        <H.H1>projects for user {targetUser.urlSlug || targetUser.id}</H.H1>
        <ProjectList targetUser={targetUser} />
      </div>
    </>
  )
})

export default UserProjects
