import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userPageGetServerSideProps } from '@/pages/user/[slug]'
import ProjectPage from '@/components/pages/Project'

const Wrapper = ({
  authUser,
  targetUser,
}: {
  authUser: ApiUser | false
  targetUser: ApiUser | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
    >
      <ProjectPage targetUser={targetUser} />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = userPageGetServerSideProps
