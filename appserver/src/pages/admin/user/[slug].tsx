import DefaultLayout from '@/components/DefaultLayout'
import UserPreview from '@/components/UserPreview'
import {
  Button,
  ConfirmationModal,
  Divider,
  Link,
  PagePad,
  Timestamp,
} from '@/components/uiLib'
import adminPages from '@/lib/adminPages'
import { sessionCookieName } from '@/lib/apiConstants'
import pathBuilder from '@/lib/pathBuilder'
import { getAuthUser } from '@/lib/serverAuth'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { useState } from 'react'
import apiClient from '@/lib/apiClient'

const Wrapper = ({
  authUser,
  userAdminOverview,
}: {
  authUser: ApiUser | false
  userAdminOverview: Awaited<ReturnType<typeof adminPages.getUserOverview>>
}) => {
  const [confirmAction, setConfirmAction] = useState<'flag' | 'unflag'>('flag')
  const [modalOpen, setModalOpen] = useState(false)
  const [working, setWorking] = useState(false)
  const handleFlag = () => {
    setConfirmAction('flag')
    setModalOpen(true)
  }
  const handleUnflag = () => {
    setConfirmAction('unflag')
    setModalOpen(true)
  }
  const handleClose = () => {
    setModalOpen(false)
  }
  const u = userAdminOverview
  const handleConfirmed = () => {
    if (!u) return // typescript
    setWorking(true)
    apiClient
      .flagUser({
        userId: u.id,
        flagged: confirmAction === 'flag',
      })
      .then(() => {
        window.location.reload()
      })
  }
  // these checks are for typescript assertion
  if (!userAdminOverview) return <></>
  if (!u) return <></>
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
          <p>
            signup at: <Timestamp millis={u.createdAt} />
          </p>
          <p>
            last post:{' '}
            {u.lastPostedAt ? <Timestamp millis={u.lastPostedAt} /> : '(never)'}
          </p>
          <p>
            last write:{' '}
            {u.lastWrite ? <Timestamp millis={u.lastWrite} /> : '(never)'}
          </p>
          <p>
            last access:{' '}
            {u.lastRead ? <Timestamp millis={u.lastRead} /> : '(never)'}
          </p>
          <p>
            num public projects / posts: {u.numPublicProjects} /{' '}
            {u.numPublicPosts}
          </p>
          <p>
            num private projects / posts: {u.numPrivateProjects} /{' '}
            {u.numPrivatePosts}
          </p>
          <Divider />
          <p>
            Flag status:{' '}
            {u.isFlagged ? (
              <strong className="text-[#f00]">flagged</strong>
            ) : (
              'none'
            )}{' '}
            &mdash;{' '}
            {u.isFlagged ? (
              <Button intent="link" className="text-md" onClick={handleUnflag}>
                un-flag
              </Button>
            ) : (
              <Button intent="link" className="text-md" onClick={handleFlag}>
                flag
              </Button>
            )}
          </p>
        </div>
        <UserPreview user={userAdminOverview} compact={false} />
      </PagePad>
      <ConfirmationModal
        isOpen={modalOpen}
        title={
          confirmAction === 'flag' ? 'Flag this user?' : 'Un-flag this user?'
        }
        onClose={handleClose}
        yesText="Yes"
        noText="no"
        onYes={handleConfirmed}
        onNo={handleClose}
        spinning={working}
      />
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
