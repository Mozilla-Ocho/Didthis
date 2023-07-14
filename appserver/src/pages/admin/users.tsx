import DefaultLayout from '@/components/DefaultLayout'
import UserPreview from '@/components/UserPreview'
import { Link, PagePad, Timestamp } from '@/components/uiLib'
import adminPages from '@/lib/adminPages'
import { sessionCookieName } from '@/lib/apiConstants'
import { getParamString } from '@/lib/nextUtils'
import pathBuilder from '@/lib/pathBuilder'
import { getAuthUser } from '@/lib/serverAuth'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

const Wrapper = ({
  authUser,
  data,
  page,
  limit,
}: {
  authUser: ApiUser | false
  data: Awaited<ReturnType<typeof adminPages.getUsers>>
  page: number
  limit: number
}) => {
  const nUsers = data.length
  return (
    <DefaultLayout authUser={authUser}>
      <PagePad wide>
        <h4 className="my-4">[admin] user profiles by last modified</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {data.map(user => {
            return (
              <div key={user.id} className="border border-[#aaa]">
                <div className="bg-[#ddd] text-sm px-2 py-1">
                  <Link href={pathBuilder.adminUser(user.publicPageSlug)}>
                    @{user.publicPageSlug}
                  </Link>{' '}
                  <span className="opacity-50">
                    (<Timestamp millis={user.profile.updatedAt} />)
                  </span>
                  {user.isFlagged && <span className='text-[#f00]'> <strong>FLAGGED</strong></span>}
                </div>
                <div className="p-2">
                  <UserPreview user={user} compact={false} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-4">
          {page > 1 ? (
            <Link intent="internalNav" href={'/admin/users?page=' + (page - 1)}>
              &larr; previous
            </Link>
          ) : (
            <div />
          )}
          {nUsers === limit ? (
            <Link intent="internalNav" href={'/admin/users?page=' + (page + 1)}>
              next &rarr;
            </Link>
          ) : (
            <div />
          )}
        </div>
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
  const pageParam = getParamString(context.req as NextApiRequest, 'page')
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1
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
  const limit = 25
  const data = await adminPages.getUsers(page, limit)
  return {
    props: {
      authUser,
      data,
      page,
      limit,
    },
  }
}
