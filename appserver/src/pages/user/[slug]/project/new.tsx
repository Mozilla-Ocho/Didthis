import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'
import NewProjectPage from '@/components/pages/ProjectNew'

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
      <NewProjectPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps
