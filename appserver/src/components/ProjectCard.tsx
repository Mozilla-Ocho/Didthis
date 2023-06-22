import pathBuilder from '@/lib/pathBuidler'
import { observer } from 'mobx-react-lite'
import { H, Link, Timestamp } from './uiLib'
import { CloudinaryImage } from './uiLib'

const ProjectCard = observer(
  ({ project, targetUser }: { project: ApiProject; targetUser: ApiUser }) => {
    const nUpdates = Object.keys(project.posts).length
    return (
      <div className="border border-edges p-6">
        <div className="grid grid-cols-[66%_34%] pb-4">
          <p className="body-bs">
            <strong>{project.scope === 'public' ? 'Public' : 'Private'}</strong>{' '}
            &mdash;{' '}
            {project.currentStatus === 'active' && <span>In progress</span>}
            {project.currentStatus === 'complete' && <span>Completed</span>}
            {project.currentStatus === 'paused' && <span>Paused</span>}
          </p>
          <p className="body-bs text-right">
            {nUpdates} update{nUpdates === 1 ? '' : 's'}
          </p>
        </div>
        <div className="grid grid-cols-[70%_30%]">
          <div className="pr-4">
            <H.H5>
              <Link
                intent="internalNav"
                href={pathBuilder.project(
                  targetUser.publicPageSlug,
                  project.id
                )}
              >
                {project.title}
              </Link>
            </H.H5>
            {project.description && <p>{project.description}</p>}
          </div>
          <div>
            {project.imageAssetId && (
              <CloudinaryImage
                assetId={project.imageAssetId}
                intent="project"
              />
            )}
          </div>
        </div>
      </div>
    )
  }
)

export default ProjectCard
