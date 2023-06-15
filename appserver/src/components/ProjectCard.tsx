import pathBuilder from '@/lib/pathBuidler'
import { observer } from 'mobx-react-lite'
import { H, Link, Timestamp } from './uiLib'
import { CloudinaryImage } from './uiLib'

const ProjectCard = observer(
  ({ project, targetUser }: { project: ApiProject; targetUser: ApiUser }) => {
    return (
      <div className="border p-4">
        <H.H3>
          <Link href={pathBuilder.project(targetUser.urlSlug, project.id)}>
            {project.title}
          </Link>
        </H.H3>
        {project.imageAssetId && <CloudinaryImage assetId={project.imageAssetId} intent="project"/>}
        <p>{project.currentStatus}</p>
        <p>{Object.keys(project.posts).length} posts</p>
        <p>
          created <Timestamp seconds={project.createdAt} />
        </p>
        <p>
          updated <Timestamp seconds={project.updatedAt} />
        </p>
      </div>
    )
  }
)

export default ProjectCard
