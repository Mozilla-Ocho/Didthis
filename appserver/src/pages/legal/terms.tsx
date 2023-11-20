import DefaultLayout from '@/components/DefaultLayout'
import Terms from '@/components/pages/Terms'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'

const Wrapper = ({
  authUser,
}: {
  authUser: ApiUser | false
}) => {
  // isThe404 is really a boolean meaning it's a static page that shouldn't
  // have auth stuff in the header.
  return (
    <DefaultLayout
      authUser={authUser}
      isThe404
    >
      <Terms />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps
