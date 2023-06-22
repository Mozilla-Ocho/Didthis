import { observer } from 'mobx-react-lite'
import ProjectCard from '@/components/ProjectCard'
import { useStore } from '@/lib/store'

const ProjectList = observer(({ targetUser }: { targetUser: ApiUser }) => {
  const store = useStore()
  if (store.user && store.user.id === targetUser.id) targetUser = store.user // reactivity
  const projects = Object.values(targetUser.profile.projects)
  projects.sort((a, b) => b.createdAt - a.createdAt)
  return (
    <div className="flex flex-col gap-4">
      {projects.length === 0 && store.user === targetUser && <p>Looks like you have no projects</p>}
      {projects.length === 0 && store.user !== targetUser && <p>No projects</p>}
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} targetUser={targetUser} />
      ))}
    </div>
  )
})

export default ProjectList
