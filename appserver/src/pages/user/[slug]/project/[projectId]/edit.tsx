import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'
import ProjectEditPage from '@/components/pages/ProjectEdit'

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
      <ProjectEditPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps
