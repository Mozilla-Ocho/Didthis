import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as userPageGetServerSideProps } from '@/pages/user/[slug]'
import UserEditPage from '@/components/pages/UserEdit'
import { GetServerSidePropsContext } from 'next'

const Wrapper = ({
  authUser,
  signupCode,
}: {
  authUser: ApiUser | false
  signupCode: string | false
}) => {
  return (
    <DefaultLayout authUser={authUser} signupCode={signupCode}>
      <UserEditPage />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // first fetch auth user via imported fn
  const indexProps = await userPageGetServerSideProps(context)
  if (indexProps.notFound) return indexProps
  // TODO i don't understand why ts is being so dense here
  if (
    !indexProps?.props?.authUser ||
    !indexProps?.props?.targetUser ||
    indexProps?.props?.targetUser === true || // this will never happen, ts thinks its possible
    indexProps?.props?.authUser?.id !== indexProps?.props?.targetUser?.id
  ) {
    return { notFound: true }
  }
  return indexProps
}
