import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { HoverCard, Link, Divider, Button, PagePad } from '@/components/uiLib'
import UserPreview from '@/components/UserPreview'
import pathBuilder from '@/lib/pathBuilder'
import { getParamString } from '@/lib/nextUtils'
import { useStore } from '@/lib/store'
import { useLocalStorage } from 'usehooks-ts'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useCallback, useEffect, useState } from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { trackingEvents } from '@/lib/trackingEvents'
import RemindersAndAlerts from '@/components/RemindersAndAlerts'
import ViralityBlurb from '@/components/ViralityBlurb'
import useAppShell, { useAppShellTopBar } from '@/lib/appShellContent'
import CoverImage from './CoverImage'
import HeadStuff from './HeadStuff'
import ShareModal from './ShareModal'
import PrivProjModal from './PrivProjModal'
import PostList from './PostList'
import ProjNotFound from './ProjNotFound'
import AddUpdatePrompt from './AddUpdatePrompt'
import SortChooser from './SortChooser'

const ProjectPage = observer(
  ({ targetUser }: { targetUser: ApiUser | false }) => {
    const store = useStore()
    const router = useRouter()
    const appShell = useAppShell()

    // 404s and initial project vars
    if (!targetUser) {
      return <ProjNotFound />
    }
    const isSelf = store.user && store.user.id === targetUser.id
    if (isSelf && store.user) targetUser = store.user // important for mobx reactivity when authed
    const projectId = getParamString(router, 'projectId')
    const focusPostId = getParamString(router, 'postId')
    const project = targetUser.profile.projects[projectId]
    if (!project) {
      return <ProjNotFound />
    }
    const posts = Object.values(project.posts)
    const numPosts = posts.length
    const isPrivate = project.scope !== 'public'

    // track pageview
    store.useTrackedPageEvent(trackingEvents.pvProject, {
      slug: targetUser.publicPageSlug,
    })

    // sharing mgmt
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const [sharePrivModalOpen, setSharePrivModalOpen] = useState(false)
    const shareUrl = pathBuilder.makeFullUrl(
      pathBuilder.project(targetUser.publicPageSlug, project.id)
    )
    const handleSharePriv = (fromNativeTopNav?: boolean) => {
      store.trackEvent(trackingEvents.bcSharePrivateProject, {
        fromNativeTopNav: fromNativeTopNav ? 'y' : 'n',
      })
      setSharePrivModalOpen(true)
    }
    const handleShare = (fromNativeTopNav?: boolean) => {
      store.trackEvent(trackingEvents.bcSharePublicProject, {
        fromNativeTopNav: fromNativeTopNav ? 'y' : 'n',
      })
      copyToClipboard(shareUrl)
      setShareModalOpen(true)
    }
    const handleCloseShare = useCallback(() => {
      setShareModalOpen(false)
      setSharePrivModalOpen(false)
    }, [setShareModalOpen, setSharePrivModalOpen])
    const handleConditionalShare = (fromNativeTopNav: boolean) => {
      // the "conditional" part is whether it's currently public or private.
      // the "fromNativeTopNav" arg is true when this is fired from a handler of the
      // top nav native app event message and is used on tracking events.
      if (isPrivate) {
        handleSharePriv(fromNativeTopNav)
      } else {
        if (!appShell.appReady) {
          handleShare(fromNativeTopNav)
        } else {
          store.trackEvent(trackingEvents.bcSharePublicProject, {
            fromNativeTopNav: fromNativeTopNav ? 'y' : 'n',
          })
          appShell.api.request('shareProjectUrl', {
            title: project.title,
            url: window.location.href,
          })
        }
      }
    }

    // sorting mgmt
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
    const changeSort = (direction: 'asc' | 'desc') => {
      setSavedSort(direction)
      setActualSort(direction)
      store.trackEvent(trackingEvents.caSetProjectSort, { direction })
    }

    // top nav
    const handleBack = () => router.push('/')
    const handleEditFromNativeTopNav = () => {
      if (!store.user) return
      store.trackEvent(trackingEvents.bcEditProject, { fromNativeTopNav: 'y' })
      router.push(pathBuilder.projectEdit(store.user.systemSlug, project.id))
    }
    useAppShellTopBar({
      show: true,
      leftLabel: 'Back', // HACK: undefined label defaults to "Back"
      leftIsBack: true,
      showShare: true,
      showEdit: true,
      onLeftPress: handleBack,
      onSharePress: () => handleConditionalShare(true),
      onEditPress: handleEditFromNativeTopNav,
    })

    return (
      <>
        {/* not visible: */}
        <HeadStuff project={project} targetUser={targetUser} />
        {/* not visible until activated: */}
        <ShareModal
          isOpen={shareModalOpen}
          handleClose={handleCloseShare}
          url={shareUrl}
        />
        <PrivProjModal
          isOpen={sharePrivModalOpen}
          handleClose={handleCloseShare}
          targetUser={targetUser}
          project={project}
        />

        {store.user && <Breadcrumbs crumbs={[{ name: project.title }]} />}

        <ViralityBlurb
          fromPage="project"
          targetUserSlug={targetUser.publicPageSlug}
        />
        <RemindersAndAlerts />

        <PagePad wide>
          <HoverCard>
            {/* outer padding */}
            <div className="md:p-4">
              <div className="flex flex-col md:flex-row items-start">
                <div className="md:w-[300px] lg:w-[400px] xl:w-[500px] md:flex-none">
                  <CoverImage
                    inAppWebView={appShell.inAppWebView}
                    project={project}
                  />

                  {/* inner padding */}
                  <div className="px-4">
                    <div
                      style={{
                        position: 'relative',
                        marginTop: '-14px',
                        zIndex: 0,
                      }}
                    >
                      <UserPreview user={targetUser} compact={true} />
                    </div>

                    <h4 className="mt-4 mb-1">{project.title}</h4>

                    <div className="grid grid-cols-[66%_34%] my-2">
                      <p className="body-bs text-sm font-bold">
                        {project.currentStatus === 'active' && (
                          <span>In Progress</span>
                        )}
                        {project.currentStatus === 'complete' && (
                          <span>Completed</span>
                        )}
                        {project.currentStatus === 'paused' && (
                          <span>Paused</span>
                        )}
                        {isPrivate && (
                          <>
                            {' '}
                            &mdash; <strong>Private</strong>
                          </>
                        )}
                      </p>
                      <p className="body-bs text-right">
                        {numPosts} update{numPosts === 1 ? '' : 's'}
                      </p>
                    </div>

                    {project.description && (
                      <p className="break-words whitespace-pre-line my-2">
                        {project.description}
                      </p>
                    )}

                    <div className="my-4 flex flex-col md:flex-row items-center gap-4">
                      {/* in mobile web, if the user owns the project, show an edit
                button alongside share button. in native app, editing is via top
                nav. */}
                      {!appShell.inAppWebView &&
                        store.user && // store.user redundant when isSelf but tsserver needs it
                        isSelf && (
                          <Link
                            id="buttonEdit"
                            className="w-full"
                            intent="secondary"
                            href={pathBuilder.projectEdit(
                              store.user.systemSlug,
                              project.id
                            )}
                            trackEvent={trackingEvents.bcEditProject}
                            trackEventOpts={{ fromNativeTopNav: 'n' }}
                          >
                            Edit project
                          </Link>
                        )}
                      <Button
                        id="buttonShare"
                        className="w-full"
                        intent="secondary"
                        onClick={() => handleConditionalShare(false)}
                      >
                        Share project
                      </Button>
                    </div>

                    <Divider light className="my-6 md:hidden" />
                  </div>
                  {/* inner padding */}
                </div>
                {/* column end */}
                <div className="w-full">
                  {/* column start. TODO: why do i need w-full here? */}
                  <div className="px-4">
                    <div className="grid grid-cols-[1fr_auto] gap-4 mb-7">
                      {numPosts > 0 && (
                        <SortChooser
                          onChange={changeSort}
                          actualSort={actualSort}
                        />
                      )}
                      {numPosts > 1 && (
                        <div className="opacity-80">
                          <AddUpdatePrompt
                            noWrapper
                            project={project}
                            isSelf={isSelf}
                          />
                        </div>
                      )}
                    </div>

                    <PostList
                      project={project}
                      sort={actualSort}
                      focusPostId={focusPostId}
                      targetUser={targetUser}
                    />

                    <AddUpdatePrompt project={project} isSelf={isSelf} />
                  </div>
                </div>
              </div>
              {/* outer padding */}
            </div>
          </HoverCard>
        </PagePad>
      </>
    )
  }
)

export default ProjectPage
