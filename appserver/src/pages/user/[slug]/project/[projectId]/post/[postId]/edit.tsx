import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userAuthPageGetServerSideProps } from '@/pages/user/[slug]/edit'
import PostEditPage from '@/components/pages/PostEdit'

const Wrapper = ({
  authUser,
}: {
  authUser: ApiUser | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
    >
      <PostEditPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = userAuthPageGetServerSideProps
