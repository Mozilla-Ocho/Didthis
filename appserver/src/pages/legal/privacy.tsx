import DefaultLayout from '@/components/DefaultLayout'
import Privacy from '@/components/pages/Privacy'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'

const Wrapper = ({
  authUser,
}: {
  authUser: ApiUser | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
    >
      <Privacy />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps
