import PageTitle from '@/components/PageTitle'
import OgMeta from '@/components/OgMeta'

const HeadStuff = ({
  project,
  targetUser,
}: {
  project: ApiProject
  targetUser: ApiUser
}) => (
  <>
    <PageTitle title={project.title} />
    <OgMeta user={targetUser} project={project} />
  </>
)

export default HeadStuff
