import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userPageGetServerSideProps } from '@/pages/user/[slug]'
import ProjectPage from '@/components/pages/Project'

const Wrapper = ({
  authUser,
  signupCode,
  targetUser,
}: {
  authUser: ApiUser | false
  signupCode: string | false
  targetUser: ApiUser | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
      signupCode={signupCode}
    >
      <ProjectPage targetUser={targetUser} />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = userPageGetServerSideProps
