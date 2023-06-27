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
import { H, PagePad } from '../uiLib'
import Breadcrumbs from '../Breadcrumbs'
import pathBuilder from '@/lib/pathBuilder'

const ProjectEditPage = observer(() => {
  const store = useStore()
  const router = useRouter()
  const user = store.user
  if (!user) return <NotFound>user not found</NotFound>
  const projectId = getParamString(router, 'projectId')
  const project = user.profile.projects[projectId]
  if (!project) return <NotFound>project not found</NotFound>
  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            name: project.title,
            href: pathBuilder.project(user.systemSlug, project.id),
          },
          { name: 'Edit' },
        ]}
      />
      <PagePad>
        <H.H3>Edit project</H.H3>
        <div className="pt-8" />
        <ProjectForm mode="edit" project={project} />
      </PagePad>
    </>
  )
})

export default ProjectEditPage
