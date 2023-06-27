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
import { useState } from 'react'
import copyToClipboard from 'copy-to-clipboard'

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
    const handleCloseShare = () => {
      setShareModalOpen(false)
    }
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
    }
    return (
      <>
        <Modal
          id="share-proj"
          isOpen={shareModalOpen}
          title="Link copied"
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
          <div className="my-4 flex flex-row items-center gap-8">
            <H.H4>{project.title}</H.H4>
          </div>
          <div className="grid grid-cols-[66%_34%] pb-4">
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

          <div className="my-4 w-full flex flex-row items-center gap-4 sm:w-[200px]">
            {store.user && isSelf && (
              <Button
                intent="secondary"
                className="flex-grow basis-8/12"
                onClick={handleShare}
              >
                Share
              </Button>
            )}
          </div>

          <div
            className={`grid gap-4 ${
              hasImage
                ? 'grid-rows-[auto_auto] sm:grid-rows-1 sm:grid-cols-[3fr_7fr]'
                : 'grid-rows-1 grid-cols-1'
            }`}
          >
            {hasImage && (
              <div>
                <CloudinaryImage
                  assetId={project.imageAssetId}
                  intent="project"
                />
              </div>
            )}
            <div>
              {project.description && (
                <p className="break-words whitespace-pre-line">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <Divider light />

          <div className="grid grid-cols-[auto_1fr] items-baseline gap-4 mb-4">
            <label htmlFor="sortby">Sort by:</label>
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

          {store.user && // store.user redundant when isSelf but tsserver needs it
            isSelf && (
              <div className="grid mb-4">
                <Link
                  intent="primary"
                  href={pathBuilder.newPost(store.user.systemSlug, project.id)}
                >
                  Add post
                </Link>
              </div>
            )}

          <div className="grid grid-cols-1 gap-8 mt-8">
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
