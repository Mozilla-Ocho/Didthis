import { observer } from 'mobx-react-lite'
import { H } from '@/components/uiLib'
import ProjectCard from '../ProjectCard'

const UserProjects = observer(({ targetUser }: { targetUser: ApiUser }) => {
  const projects = Object.values(targetUser.profile.projects)
  projects.sort((a, b) => a.createdAt - b.createdAt)
  return (
    <>
      <div>
        <H.H1>projects for user {targetUser.urlSlug || targetUser.id}</H.H1>
        {projects.length === 0 && <p>None</p>}
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} targetUser={targetUser} />
        ))}
      </div>
    </>
  )
})

export default UserProjects
