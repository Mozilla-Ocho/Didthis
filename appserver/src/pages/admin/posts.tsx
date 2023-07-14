import DefaultLayout from '@/components/DefaultLayout'
import PostCard from '@/components/PostCard'
import { Link, PagePad } from '@/components/uiLib'
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
  data: Awaited<ReturnType<typeof adminPages.getPosts>>
  page: number
  limit: number
}) => {
  const nPosts = data.posts.length
  return (
    <DefaultLayout authUser={authUser}>
      <PagePad wide>
        <h4 className="my-4">[admin] public posts by last modified</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {data.posts.map(p => {
            const uid = p.userid
            const projid = p.projectid
            const postid = p.postid
            const user = data.users[uid]
            const proj = user.profile.projects[projid]
            const post = proj.posts[postid]
            return (
              <div key={postid} className="border border-[#aaa]">
                <div className="bg-[#ddd] text-sm px-2 py-1">
                  <Link external href={pathBuilder.user(user.publicPageSlug)}>
                    @{user.publicPageSlug}
                  </Link>{' '}
                  &raquo;{' '}
                  <Link
                    external
                    href={pathBuilder.post(user.publicPageSlug, proj.id, postid)}
                  >
                    {proj.title}
                  </Link>
                </div>
                <div className="p-2">
                  <PostCard
                    post={post}
                    targetUser={user}
                    authUser={false}
                    focused={false}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-4">
          {page > 1 ? (
            <Link intent="internalNav" href={'/admin/posts?page=' + (page - 1)}>
              &larr; previous
            </Link>
          ) : (
            <div />
          )}
          {nPosts === limit ? (
            <Link intent="internalNav" href={'/admin/posts?page=' + (page + 1)}>
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
  const limit = 4
  const data = await adminPages.getPosts(page, limit)
  return {
    props: {
      authUser,
      data,
      page,
      limit,
    },
  }
}
