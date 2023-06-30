import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userAuthPageGetServerSideProps } from '@/pages/user/[slug]/edit'
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
    >
      <ProjectEditPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = userAuthPageGetServerSideProps
