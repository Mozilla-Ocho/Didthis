import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import ProjectForm from '../forms/ProjectForm'
import LoginBouncer from '@/components/auth/LoginBouncer'
import { H } from '@/components/uiLib'

const NewProjectPage = observer(() => {
  const store = useStore()
  if (!store.user) return <LoginBouncer />
  return (
    <>
      <H.H3>Create a project</H.H3>
      <div className="pt-8" />
      <ProjectForm mode="new" />
    </>
  )
})

export default NewProjectPage
