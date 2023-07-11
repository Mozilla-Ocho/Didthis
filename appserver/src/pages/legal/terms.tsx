import DefaultLayout from '@/components/DefaultLayout'
import Terms from '@/components/pages/Terms'
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
      <Terms />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps
