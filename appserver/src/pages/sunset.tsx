import DefaultLayout from '@/components/DefaultLayout'
import Sunset from '@/components/pages/Sunset'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'

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
     <Sunset />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps

