import DefaultLayout from '@/components/DefaultLayout'
import ProjectCard from '@/components/ProjectCard'
import { Link } from '@/components/uiLib'
import adminPages from '@/lib/adminPages'
import { sessionCookieName } from '@/lib/apiConstants'
import { getParamString } from '@/lib/nextUtils'
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
      <h4 className="my-4">[admin] public projects by last modified</h4>
      <div className="flex flex-row flex-wrap gap-4">
        {data.projects.map(p => {
          const uid = p[0]
          const pid = p[1]
          const user = data.users[uid]
          const proj = user.profile.projects[pid]
          return (
            <div key={pid}>
              <ProjectCard project={proj} targetUser={user} />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between">
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
