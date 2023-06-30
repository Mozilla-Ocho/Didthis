import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userAuthPageGetServerSideProps } from '@/pages/user/[slug]/edit'
import PostEditPage from '@/components/pages/PostEdit'

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
      <PostEditPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = userAuthPageGetServerSideProps
