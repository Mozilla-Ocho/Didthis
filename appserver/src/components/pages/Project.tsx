import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import {
  Link,
  Divider,
  CloudinaryImage,
  Button,
  Select,
  Modal,
  Input,
  PagePad,
  ConfirmationModal,
} from '../uiLib'
import UserPreview from '../UserPreview'
import pathBuilder from '@/lib/pathBuilder'
import { getParamString } from '@/lib/nextUtils'
import NotFound from './NotFound'
import PostCard from '../PostCard'
import { useStore } from '@/lib/store'
import { useLocalStorage } from 'usehooks-ts'
import Breadcrumbs from '../Breadcrumbs'
import { useCallback, useEffect, useState } from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { specialAssetIds } from '@/lib/cloudinaryConfig'
import { trackingEvents } from '@/lib/trackingEvents'
import PageTitle from '../PageTitle'
import OgMeta from '../OgMeta'
import DiscordNag from '../DiscordNag'

const ProjectPage = observer(
  ({ targetUser }: { targetUser: ApiUser | false }) => {
    // const store = useStore();
    if (!targetUser) return <NotFound>user not found</NotFound>
    const router = useRouter()
    const store = useStore()
    store.useTrackedPageEvent(trackingEvents.pvProject, {
      slug: targetUser.publicPageSlug,
    })
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const [sharePrivModalOpen, setSharePrivModalOpen] = useState(false)
    const [savedSort, setSavedSort] = useLocalStorage<'asc' | 'desc'>(
      'projectSortDefault',
      'desc'
    )
    const [actualSort, setActualSort] = useState<'asc' | 'desc'>('desc')
    useEffect(() => {
      // SSR consistency. reflow sort after render if different from default,
      // because server doesn't know the local storage preference.
      if (actualSort !== savedSort) setActualSort(savedSort)
    }, [actualSort, setActualSort, savedSort])
    const isSelf = store.user && store.user.id === targetUser.id
    if (isSelf && store.user) targetUser = store.user // important for mobx reactivity when authed
    const projectId = getParamString(router, 'projectId')
    const focusPostId = getParamString(router, 'postId')
    const project = targetUser.profile.projects[projectId]
    if (!project) return <NotFound>project not found</NotFound>
    const posts = Object.values(project.posts)
    posts.sort((a, b) =>
      actualSort === 'desc'
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt
    )
    const numPosts = posts.length
    const hasImage = !!project.imageAssetId
    const isPrivate = project.scope !== 'public'
    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const direction = e.target.value as 'asc' | 'desc'
      setSavedSort(direction)
      setActualSort(direction)
      store.trackEvent(trackingEvents.caSetProjectSort, { direction })
    }
    const shareUrl = pathBuilder.makeFullUrl(
      pathBuilder.project(targetUser.publicPageSlug, project.id)
    )
    const handleSharePriv = () => {
      store.trackEvent(trackingEvents.bcSharePrivateProject)
      setSharePrivModalOpen(true)
    }
    const handleShare = () => {
      store.trackEvent(trackingEvents.bcSharePublicProject)
      copyToClipboard(shareUrl)
      setShareModalOpen(true)
    }
    const handleCloseShare = useCallback(() => {
      setShareModalOpen(false)
      setSharePrivModalOpen(false)
    }, [setShareModalOpen, setSharePrivModalOpen])
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
    }
    return (
      <>
        <PageTitle title={project.title} />
        <OgMeta user={targetUser} project={project} />
        <Modal
          isOpen={shareModalOpen}
          srTitle="Link copied"
          renderTitleHeading
          handleClose={handleCloseShare}
        >
          <p>The link for this project has been copied to the clipboard.</p>
          <Input
            type="text"
            value={shareUrl}
            onFocus={handleFocus}
            onChange={() => null}
            className="my-2"
          />
          <div className="grid grid-cols-1 mt-8">
            <Button intent="primary" onClick={handleCloseShare}>
              OK
            </Button>
          </div>
        </Modal>
        <ConfirmationModal
          isOpen={sharePrivModalOpen}
          title="This project is private"
          yesText="OK"
          onYes={handleCloseShare}
          onClose={handleCloseShare}
        >
          This project is currently set private. To get a shareable link, edit
          the project and set it to public.
          <Link
            intent="secondary"
            className="my-4 w-full"
            href={pathBuilder.projectEdit(
              targetUser.publicPageSlug,
              project.id
            )}
          >
            Edit project
          </Link>
        </ConfirmationModal>
        <Breadcrumbs crumbs={[{ name: project.title }]} />
        <DiscordNag/>
        <PagePad>
          <UserPreview user={targetUser} compact={true} />

          <div className="grid grid-cols-[66%_34%] my-4">
            <p className="body-bs">
              <strong>{isPrivate ? 'Private' : 'Public'}</strong> &mdash;{' '}
              {project.currentStatus === 'active' && <span>In Progress</span>}
              {project.currentStatus === 'complete' && <span>Completed</span>}
              {project.currentStatus === 'paused' && <span>Paused</span>}
            </p>
            <p className="body-bs text-right">
              {numPosts} post{numPosts === 1 ? '' : 's'}
            </p>
          </div>

          {/* final placeholder XXX */}
          <div className="my-4">
            {hasImage ? (
              <CloudinaryImage
                assetId={project.imageAssetId}
                intent="project"
                lightbox
              />
            ) : (
              <CloudinaryImage
                assetId={specialAssetIds.placholderProjectID}
                rounded
                intent="project"
              />
            )}
          </div>

          <h4 className="mt-4 mb-2">{project.title}</h4>

          {project.description && (
            <p className="break-words whitespace-pre-line my-2">
              {project.description}
            </p>
          )}

          <div className="my-4 flex flex-col sm:flex-row items-center gap-4">
            {store.user && // store.user redundant when isSelf but tsserver needs it
              isSelf && (
                <Link
                  className="w-full sm:w-auto"
                  intent="secondary"
                  href={pathBuilder.projectEdit(store.user.systemSlug, project.id)}
                  trackEvent={trackingEvents.bcEditProject}
                >
                  Edit project
                </Link>
              )}
            <Button
              className="w-full sm:w-auto"
              intent="secondary"
              onClick={
                isPrivate /* tracking handled in these handler fns */
                  ? handleSharePriv
                  : handleShare
              }
            >
              Share project
            </Button>
          </div>

          <Divider light className="my-6" />

          {store.user && // store.user redundant when isSelf but tsserver needs it
            isSelf && (
              <div className="my-4 flex flex-row items-center gap-4">
                <Link
                  className="grow basis-1 sm:grow-0 sm:basis-auto"
                  intent="primary"
                  href={pathBuilder.newPost(store.user.systemSlug, project.id)}
                  trackEvent={trackingEvents.bcAddPost}
                  trackEventOpts={{ fromPage: 'project' }}
                >
                  Add post
                </Link>
              </div>
            )}

          <div className="flex flex-row items-baseline gap-4 my-12 text-sm">
            <label htmlFor="block sortby">Sort by:</label>
            <div className="grow sm:grow-0">
              <Select
                id="sortby"
                onChange={changeSort}
                value={actualSort}
                className="text-bodytext text-sm"
              >
                <option key="desc" value="desc">
                  Newest first
                </option>
                <option key="asc" value="asc">
                  Oldest first
                </option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-16">
            {/* even though we return above if targetUser is falsy, because map is
           passed a function, typescript can't assert that inside that function
           scope that targetUser is still surely not false. hence "as ApiUser"*/}
            {posts.map(p => (
              <PostCard
                key={p.id}
                post={p}
                authUser={store.user}
                targetUser={targetUser as ApiUser}
                focused={focusPostId === p.id}
              />
            ))}
          </div>
        </PagePad>
      </>
    )
  }
)

export default ProjectPage
