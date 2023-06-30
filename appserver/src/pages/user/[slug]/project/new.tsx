import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userAuthPageGetServerSideProps } from '@/pages/user/[slug]/edit'
import NewProjectPage from '@/components/pages/ProjectNew'

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
      <NewProjectPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = userAuthPageGetServerSideProps
