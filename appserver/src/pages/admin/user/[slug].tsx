import DefaultLayout from '@/components/DefaultLayout'
import UserPreview from '@/components/UserPreview'
import { Link, PagePad, Timestamp } from '@/components/uiLib'
import adminPages from '@/lib/adminPages'
import { sessionCookieName } from '@/lib/apiConstants'
import pathBuilder from '@/lib/pathBuilder'
import { getAuthUser } from '@/lib/serverAuth'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

const Wrapper = ({
  authUser,
  userAdminOverview,
}: {
  authUser: ApiUser | false
  userAdminOverview: Awaited<ReturnType<typeof adminPages.getUserOverview>>
}) => {
  if (!userAdminOverview) return <></>
  const u = userAdminOverview
  return (
    <DefaultLayout authUser={authUser}>
      <PagePad wide>
        <h4 className="my-4">[admin] user overview</h4>
        <div className="border p-4 bg-black-100 my-4">
          <p>
            public page:{' '}
            <Link external href={pathBuilder.user(u.publicPageSlug)}>
              {pathBuilder.user(u.publicPageSlug)}
            </Link>
          </p>
          <p>email: {u.email}</p>
          <p>signup code: {u.signupCodeName}</p>
          <p>system slug: {u.systemSlug}</p>
          <p>user slug: {u.userSlug || '(none)'}</p>
          <p>signup at: <Timestamp millis={u.createdAt} /></p>
          <p>last post: {u.lastPostedAt ? <Timestamp millis={u.lastPostedAt} /> : '(never)'}</p>
          <p>last write: {u.lastWrite ? <Timestamp millis={u.lastWrite} /> : '(never)'}</p>
          <p>last access: {u.lastRead ? <Timestamp millis={u.lastRead} /> : '(never)'}</p>
          <p>num public projects / posts: {u.numPublicProjects} / {u.numPublicPosts}</p>
          <p>num private projects / posts: {u.numPrivateProjects} / {u.numPrivatePosts}</p>
        </div>
        <UserPreview user={userAdminOverview} compact={false} />
      </PagePad>
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let authUser: ApiUser | false = false
  const sessionCookie = context.req.cookies[sessionCookieName]
  if (sessionCookie) {
    const res = await getAuthUser(
      context.req as NextApiRequest,
      context.res as NextApiResponse
    )
    authUser = res[0]
  }
  if (!authUser || !authUser.isAdmin) {
    return { notFound: true }
  }
  if (!context.params || !context.params.slug) {
    return { notFound: true }
  }
  const urlSlug = Array.isArray(context.params.slug)
    ? context.params.slug[0] || ''
    : context.params.slug
  const userAdminOverview = await adminPages.getUserOverview(urlSlug)
  if (!userAdminOverview) {
    return { notFound: true }
  }
  return {
    props: {
      authUser,
      userAdminOverview,
    },
  }
}
