import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import ProjectForm from '../forms/ProjectForm'
import LoginBouncer from '@/components/auth/LoginBouncer'
import { PagePad } from '@/components/uiLib'
import Breadcrumbs from '../Breadcrumbs'

const NewProjectPage = observer(() => {
  const store = useStore()
  if (!store.user) return <LoginBouncer />
  return (
    <>
      <Breadcrumbs crumbs={[{ name: 'New project' }]} />
      <PagePad>
        <h3>Create a project</h3>
        <div className="pt-8" />
        <ProjectForm mode="new" />
      </PagePad>
    </>
  )
})

export default NewProjectPage
