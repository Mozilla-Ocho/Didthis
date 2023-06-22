import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import ProjectForm from '../forms/ProjectForm'
import LoginBouncer from '@/components/auth/LoginBouncer'
import { H } from '@/components/uiLib'

const NewProjectPage = observer(() => {
  const store = useStore()
  const router = useRouter()
  if (!store.user) return <LoginBouncer />
  return (
    <div className="pt-4 px-4">
      <H.H3>Create a project</H.H3>
      <div className="pt-8" />
      <ProjectForm mode="new" />
    </div>
  )
})

export default NewProjectPage
