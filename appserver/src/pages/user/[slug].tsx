import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'
import apiClient from '@/lib/apiClient'
import { GetServerSidePropsContext } from 'next'
import HomeAuth from '@/components/pages/HomeAuth'
import UnauthUser from '@/components/pages/UnauthUser'
import pathBuilder from '@/lib/pathBuilder'

const Wrapper = ({
  authUser,
  targetUser,
}: {
  authUser: ApiUser | false
  targetUser: ApiUser | false
}) => {
  return (
    <DefaultLayout authUser={authUser} >
      {authUser && targetUser && authUser.id === targetUser.id ? (
        <HomeAuth />
      ) : (
        <UnauthUser targetUser={targetUser} />
      )}
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
      // self-view of a properly case sensitive match on slug. don't use
      // getPublicUser and use the authUser instead.
      targetUser = indexProps.props.authUser
    } else {
      targetUser = (
        await apiClient.getPublicUser({ urlSlug }).catch(() => {
          // XXX differentiate not found from other errors...
          return { payload: false }
        })
      ).payload as ApiUser | false
      if (!targetUser) {
        return { notFound: true }
      }
      if (targetUser.isFlagged) {
        return { notFound: true }
      }
      if (
        targetUser.userSlug !== urlSlug &&
        targetUser.systemSlug !== urlSlug
      ) {
        // probably a case-insensitive slug match, redirect permanently to the
        // preferred slug for this user.
        // TODO: this same function gets used for project pages and stuff, but
        // this redirect just goes to their homepage. make it route aware.
        return {
          redirect: {
            destination: pathBuilder.user(targetUser.publicPageSlug),
            permanent: true,
          },
        }
      }
    }
  }
  return { props: { ...indexProps.props, targetUser } }
}
