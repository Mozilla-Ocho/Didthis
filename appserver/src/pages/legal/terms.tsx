import DefaultLayout from '@/components/DefaultLayout'
import Terms from '@/components/pages/Terms'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'

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
      <Terms />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps
