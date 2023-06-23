import pathBuilder from '@/lib/pathBuilder'
import { useStore } from '@/lib/store'
import { observer } from 'mobx-react-lite'
import { H, Link } from './uiLib'
import { CloudinaryImage } from './uiLib'

const ProjectCard = observer(
  ({ project, targetUser }: { project: ApiProject; targetUser: ApiUser }) => {
    const store = useStore()
    const isSelf = store.user && store.user.id === targetUser.id
    const nUpdates = Object.keys(project.posts).length
    const hasImage = !!project.imageAssetId
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
        <div
          className={`grid ${hasImage ? 'grid-cols-[70%_30%]' : 'grid-cols-1'}`}
        >
          <div className="pr-4">
            <H.H5>
              <Link
                intent="internalNav"
                href={pathBuilder.project(
                  targetUser.publicPageSlug,
                  project.id
                )}
                className="break-words"
              >
                {project.title}
              </Link>
            </H.H5>
            {project.description && (
              <p className="break-words my-2 whitespace-pre-line line-clamp-2 sm:line-clamp-4 md:line-clamp-5">
                {project.description}
              </p>
            )}
            {isSelf && store.user && (
              <p className="mt-4">
                <Link
                  intent="secondary"
                  href={pathBuilder.projectEdit(
                    store.user.systemSlug,
                    project.id
                  )}
                >
                  Edit
                </Link>
              </p>
            )}
          </div>
          {hasImage && (
            <div>
              <CloudinaryImage
                assetId={project.imageAssetId}
                intent="project"
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)

export default ProjectCard
