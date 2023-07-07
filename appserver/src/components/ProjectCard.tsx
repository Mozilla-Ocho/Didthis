import { specialAssetIds } from '@/lib/cloudinaryConfig'
import pathBuilder from '@/lib/pathBuilder'
import { useStore } from '@/lib/store'
import {trackingEvents} from '@/lib/trackingEvents'
import { observer } from 'mobx-react-lite'
import { Link } from './uiLib'
import { CloudinaryImage } from './uiLib'

const ProjectCard = observer(
  ({ project, targetUser }: { project: ApiProject; targetUser: ApiUser }) => {
    const store = useStore()
    const isSelf = store.user && store.user.id === targetUser.id
    const nUpdates = Object.keys(project.posts).length
    const hasImage = !!project.imageAssetId
    const projUrl = pathBuilder.project(targetUser.publicPageSlug, project.id)
    return (
      <div className="border border-edges rounded-md overflow-hidden w-full basis-full sm:w-[373px] sm:basis-[373px]">
        {hasImage ? (
          <CloudinaryImage linkTo={projUrl} assetId={project.imageAssetId} intent="project" />
        ) : (
          <CloudinaryImage
            linkTo={projUrl}
            assetId={specialAssetIds.placholderProjectID}
            rounded
            intent="project"
          />
        )}

        <div className="p-6">
          <div className="grid grid-cols-[66%_34%] mb-4">
            <p className="body-bs">
              <strong>
                {project.scope === 'public' ? 'Public' : 'Private'}
              </strong>{' '}
              &mdash;{' '}
              {project.currentStatus === 'active' && <span>In Progress</span>}
              {project.currentStatus === 'complete' && <span>Completed</span>}
              {project.currentStatus === 'paused' && <span>Paused</span>}
            </p>
            <p className="body-bs text-right">
              {nUpdates} update{nUpdates === 1 ? '' : 's'}
            </p>
          </div>

          <h5 className="mt-4 mb-2">
            <Link
              intent="internalNav"
              href={projUrl}
              className="break-words"
            >
              {project.title}
            </Link>
          </h5>

          <p className="break-words my-2 whitespace-pre-line line-clamp-2 min-h-[44px] text-sm">
            {project.description ? (
              project.description
            ) : (
              <span className="text-form-labels">No project description</span>
            )}
          </p>

          {isSelf && store.user && (
            <p className="mt-4">
              <Link
                intent="secondary"
                className="px-4 py-1"
                href={pathBuilder.projectEdit(
                  store.user.systemSlug,
                  project.id
                )}
                trackEvent={trackingEvents.bcEditProjectFromCard}
              >
                Edit
              </Link>
            </p>
          )}
        </div>
      </div>
    )
  }
)

export default ProjectCard
