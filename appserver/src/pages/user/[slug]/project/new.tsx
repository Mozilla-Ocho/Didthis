import { useRouter } from 'next/router'

import DefaultLayout from '@/components/DefaultLayout'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'

import { H } from '@/components/uiLib'
import LoginBouncer from '@/components/auth/LoginBouncer'
import ProjectForm from '@/components/forms/ProjectForm'

const NewProject = observer(() => {
  const store = useStore()
  const router = useRouter()
  if (!store.user) return <LoginBouncer />
  return (
    <>
      <div>
        <H.H1>new project for user {router.query.slug}</H.H1>
        <ProjectForm />
      </div>
    </>
  )
})

const Wrapper = ({
  authUser,
  signupCode,
}: {
  authUser: ApiUser | false
  signupCode: string | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
      signupCode={signupCode}
      headerFooter="always"
    >
      <NewProject />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps
