import { observer } from 'mobx-react-lite'
import ProjectCard from '@/components/ProjectCard'
import { useStore } from '@/lib/store'

const ProjectList = observer(({ targetUser }: { targetUser: ApiUser }) => {
  const store = useStore()
  if (store.user && store.user.id === targetUser.id) targetUser = store.user // reactivity
  const projects = Object.values(targetUser.profile.projects)
  projects.sort((a, b) => b.createdAt - a.createdAt)
  if (projects.length === 0) {
    if (store.user && store.user.id === targetUser.id) {
      return <p>Looks like you have no projects</p>
    } else {
      return <p>No projects</p>
    }
  }
  return (
    <div className="flex flex-row gap-4 sm:gap-5 flex-wrap">
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} targetUser={targetUser} />
      ))}
    </div>
  )
})

export default ProjectList
