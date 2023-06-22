// import { useStore } from "@/lib/store";
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
// import { H, Link, Timestamp, Divider } from '../uiLib'
// import UserPreview from '../UserPreview'
// import pathBuilder from '@/lib/pathBuidler'
import { getParamString } from '@/lib/nextUtils'
import NotFound from './NotFound'
import { useStore } from '@/lib/store'
import ProjectForm from '../forms/ProjectForm'
import {H} from '../uiLib'

const ProjectEditPage = observer(() => {
  const store = useStore()
  const router = useRouter()
  const user = store.user
  if (!user) return <NotFound>user not found</NotFound>
  const projectId = getParamString(router, 'projectId')
  const project = user.profile.projects[projectId]
  if (!project) return <NotFound>project not found</NotFound>
  return (
    <div className="pt-4 px-4">
      <H.H3>Create a project</H.H3>
      <div className="pt-8" />
      <ProjectForm mode="edit" project={project} />
    </div>
  )
})

export default ProjectEditPage
