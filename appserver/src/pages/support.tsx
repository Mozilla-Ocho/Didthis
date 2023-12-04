import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'
import Support from '@/components/pages/Support'

const Wrapper = ({
  authUser,
}: {
  authUser: ApiUser | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
      isThe404
    >
     <Support />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps

