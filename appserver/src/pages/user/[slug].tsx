import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'
import apiClient from '@/lib/apiClient'
import { GetServerSidePropsContext } from 'next'
import HomeAuth from '@/components/pages/HomeAuth'
import UnauthUser from '@/components/pages/UnauthUser'

const Wrapper = ({
  authUser,
  signupCode,
  targetUser,
}: {
  authUser: ApiUser | false
  signupCode: string | false
  targetUser: ApiUser | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
      signupCode={signupCode}
      headerFooter="always"
    >
      {authUser ? <HomeAuth /> : <UnauthUser targetUser={targetUser} />}
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // first fetch auth user via imported fn
  const indexProps = await indexPageGetServerSideProps(context)
  // now fetch user we're looking at
  let targetUser: ApiUser | false = false
  if (context.params?.slug) {
    const urlSlug = Array.isArray(context.params.slug)
      ? context.params.slug[0] || ''
      : context.params.slug
    if (
      indexProps.props.authUser &&
      (indexProps.props.authUser.userSlug === urlSlug ||
      indexProps.props.authUser.systemSlug === urlSlug)
    ) {
      // self-view. don't use getPublicUser and use the authUser instead.
      targetUser = indexProps.props.authUser
    } else {
      targetUser = (
        await apiClient.getPublicUser({ urlSlug }).catch(() => {
          // XXX differentiate not found from other errors...
          return { payload: false }
        })
      ).payload as ApiUser | false
    }
  }
  return { props: { ...indexProps.props, targetUser } }
}
