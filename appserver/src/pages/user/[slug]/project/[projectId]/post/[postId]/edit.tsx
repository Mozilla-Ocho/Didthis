import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userPageGetServerSideProps } from '@/pages/user/[slug]'
import NotFound from '@/components/pages/NotFound'
import PostEditPage from '@/components/pages/PostEdit'

const Wrapper = ({
  authUser,
  signupCode,
  targetUser,
}: {
  authUser: ApiUser | false
  signupCode: string | false
  targetUser: ApiUser | false
}) => {
  if (!targetUser) return <NotFound />
  if (!authUser) return <NotFound />
  if (targetUser.id !== authUser.id) return <NotFound />
  return (
    <DefaultLayout
      authUser={authUser}
      signupCode={signupCode}
      headerFooter="always"
    >
      <PostEditPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = userPageGetServerSideProps
