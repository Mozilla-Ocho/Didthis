import DefaultLayout from '@/components/DefaultLayout'
import ProjectCard from '@/components/ProjectCard'
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
  data: Awaited<ReturnType<typeof adminPages.getProjects>>
  page: number
  limit: number
}) => {
  const nProjects = data.projects.length
  return (
    <DefaultLayout authUser={authUser}>
      <PagePad wide>
      <h4 className="my-4">[admin] public projects by last modified</h4>
      <div className="flex flex-row flex-wrap gap-4">
        {data.projects.map(p => {
          const uid = p[0]
          const pid = p[1]
          const user = data.users[uid]
          const proj = user.profile.projects[pid]
          return (
            <div key={pid} className="">
              <div className="bg-[#ddd] text-sm px-2 py-1">
                <Link href={pathBuilder.adminUser(user.publicPageSlug)}>
                  @{user.publicPageSlug}
                </Link>{' '}
                &raquo;{' '}
                <Link
                  external
                  href={pathBuilder.project(user.publicPageSlug, proj.id)}
                >
                  {proj.title}
                </Link>
                {user.isFlagged && <span className='text-[#f00]'> <strong>FLAGGED</strong></span>}
              </div>
              <ProjectCard project={proj} targetUser={user} />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-4">
        {page > 1 ? (
          <Link
            intent="internalNav"
            href={'/admin/projects?page=' + (page - 1)}
          >
            &larr; previous
          </Link>
        ) : (
          <div />
        )}
        {nProjects === limit ? (
          <Link
            intent="internalNav"
            href={'/admin/projects?page=' + (page + 1)}
          >
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
  const data = await adminPages.getProjects(page, limit)
  return {
    props: {
      authUser,
      data,
      page,
      limit,
    },
  }
}
