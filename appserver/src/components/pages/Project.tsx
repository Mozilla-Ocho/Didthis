// import { useStore } from "@/lib/store";
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import {
  H,
  Link,
  Timestamp,
  Divider,
  CloudinaryImage,
  Button,
  Select,
  Modal,
  Input,
  PagePad,
} from '../uiLib'
import UserPreview from '../UserPreview'
import pathBuilder from '@/lib/pathBuilder'
import { getParamString } from '@/lib/nextUtils'
import NotFound from './NotFound'
import PostCard from '../PostCard'
import { useStore } from '@/lib/store'
import { useLocalStorage } from 'usehooks-ts'
import Breadcrumbs from '../Breadcrumbs'
import { useCallback, useState } from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { specialAssetIds } from '@/lib/cloudinaryConfig'

const ProjectPage = observer(
  ({ targetUser }: { targetUser: ApiUser | false }) => {
    // const store = useStore();
    if (!targetUser) return <NotFound>user not found</NotFound>
    const router = useRouter()
    const store = useStore()
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const [sort, setSort] = useLocalStorage<'asc' | 'desc'>(
      'projectSortDefault',
      'desc'
    )
    const isSelf = store.user && store.user.id === targetUser.id
    if (isSelf && store.user) targetUser = store.user // important for mobx reactivity when authed
    const projectId = getParamString(router, 'projectId')
    const focusPostId = getParamString(router, 'postId')
    const project = targetUser.profile.projects[projectId]
    if (!project) return <NotFound>project not found</NotFound>
    const posts = Object.values(project.posts)
    posts.sort((a, b) =>
      sort === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    )
    const nUpdates = posts.length
    const hasImage = !!project.imageAssetId
    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSort(e.target.value as 'asc' | 'desc')
    }
    const shareUrl = pathBuilder.makeFullUrl(
      pathBuilder.project(targetUser.publicPageSlug, project.id)
    )
    const handleShare = () => {
      copyToClipboard(shareUrl)
      setShareModalOpen(true)
    }
    const handleCloseShare = useCallback(() => {
      setShareModalOpen(false)
    }, [setShareModalOpen])
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
    }
    return (
      <>
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
        <Breadcrumbs crumbs={[{ name: project.title }]} />
        <PagePad>
          <UserPreview user={targetUser} compact={true} />

          <div className="grid grid-cols-[66%_34%] my-4">
            <p className="body-bs">
              <strong>
                {project.scope === 'public' ? 'Public' : 'Private'}
              </strong>{' '}
              &mdash;{' '}
              {project.currentStatus === 'active' && <span>In progress</span>}
              {project.currentStatus === 'complete' && <span>Completed</span>}
              {project.currentStatus === 'paused' && <span>Paused</span>}
            </p>
            <p className="body-bs text-right">
              {nUpdates} update{nUpdates === 1 ? '' : 's'}
            </p>
          </div>

          {/* final placeholder XXX */}
          <div className="my-4">
            {hasImage ? (
              <CloudinaryImage
                assetId={project.imageAssetId}
                intent="project"
              />
            ) : (
              <CloudinaryImage
                assetId={specialAssetIds.defaultAvatarID}
                intent="project"
              />
            )}
          </div>

          <H.H4 className="mt-4 mb-2">{project.title}</H.H4>

          {project.description && (
            <p className="break-words whitespace-pre-line my-2">
              {project.description}
            </p>
          )}

          <div className="my-4 flex flex-row items-center gap-4">
            {store.user && // store.user redundant when isSelf but tsserver needs it
              isSelf && (
                <Link
                  className="grow basis-1 sm:grow-0 sm:basis-auto"
                  intent="primary"
                  href={pathBuilder.newPost(store.user.systemSlug, project.id)}
                >
                  Add post
                </Link>
              )}
            <Button
              className="grow basis-1 sm:grow-0 sm:basis-auto"
              intent="secondary"
              onClick={handleShare}
            >
              Share project
            </Button>
          </div>

          <Divider light className="my-6" />

          <div className="flex flex-row items-baseline gap-4 mb-4">
            <label htmlFor="block sortby">Sort by:</label>
            <div className="grow sm:grow-0">
              <Select
                id="sortby"
                onChange={changeSort}
                value={sort}
                className="text-bodytext"
              >
                <option key="desc" value="desc">
                  newest first
                </option>
                <option key="asc" value="asc">
                  oldest first
                </option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-16 mt-16">
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
