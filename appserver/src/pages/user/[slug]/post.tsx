import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userAuthPageGetServerSideProps } from '@/pages/user/[slug]/edit'
import NewPostPage from '@/components/pages/PostNew'

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
      <NewPostPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = userAuthPageGetServerSideProps
