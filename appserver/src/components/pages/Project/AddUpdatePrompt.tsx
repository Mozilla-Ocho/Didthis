import { Link } from '@/components/uiLib'
import pathBuilder from '@/lib/pathBuilder'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'

const AddUpdatePrompt = ({
  project,
  isSelf,
  noWrapper,
}: {
  project: ApiProject
  isSelf: boolean
  noWrapper?: boolean
}) => {
  const store = useStore()
  if (!store.user || !isSelf) return <></>
  const button = (
    <Link
      className="grow basis-1 sm:grow-0 sm:basis-auto"
      intent="primary"
      href={pathBuilder.newPost(store.user.systemSlug, project.id)}
      trackEvent={trackingEvents.bcAddPost}
      trackEventOpts={{ fromPage: 'project' }}
    >
      Add update
    </Link>
  )
  if (noWrapper) return button
  return (
    <div className="my-6 flex flex-row justify-center items-center gap-4">
      {button}
    </div>
  )
}

export default AddUpdatePrompt
