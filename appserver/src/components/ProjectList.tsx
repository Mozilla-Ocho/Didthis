import { observer } from 'mobx-react-lite'
import ProjectCard from '@/components/ProjectCard'
import { useStore } from '@/lib/store'

const ProjectList = observer(({ targetUser }: { targetUser: ApiUser }) => {
  const store = useStore()
  if (store.user && store.user.id === targetUser.id) targetUser = store.user // reactivity
  const projects = Object.values(targetUser.profile.projects)
  projects.sort((a, b) => a.createdAt - b.createdAt)
  return (
    <>
      <div>
        {projects.length === 0 && <p>None</p>}
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} targetUser={targetUser} />
        ))}
      </div>
    </>
  )
})

export default ProjectList
