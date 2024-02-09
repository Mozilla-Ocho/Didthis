import { observer } from 'mobx-react-lite'
import { Timestamp, CloudinaryImage, Link, Icon } from './uiLib'
import pathBuilder from '@/lib/pathBuilder'
import LinkPreview from './LinkPreview'
import { trackingEvents } from '@/lib/trackingEvents'
import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'

const PostCard = observer(
  ({
    post,
    authUser,
    targetUser,
    focused,
  }: {
    post: ApiPost
    authUser: ApiUser | false
    targetUser: ApiUser
    focused: boolean
  }) => {
    const isSelf = authUser && authUser.id === targetUser.id
    const [highlight, setHighlight] = useState(false)
    useEffect(() => {
      if (focused && window && window.document) {
        const div = window.document.querySelector('#focused-post')
        if (div) {
          const timer1 = setTimeout(() => {
            div.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }, 200)
          const timer2 = setTimeout(() => {
            setHighlight(true)
          }, 400)
          const timer3 = setTimeout(() => {
            setHighlight(false)
          }, 800)
          return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
          }
        }
      }
    }, [focused, setHighlight])
    let iconType = 'text'
    if (post.imageAssetId) iconType = 'image'
    if (post.linkUrl) iconType = 'link'
    return (
      <div
        id={focused ? 'focused-post' : ''}
        className={twMerge(
          'transition duration-500',
          highlight
            ? 'bg-yellow-300 drop-shadow-[0px_0px_2px_#f4c005]'
            : ''
        )}
        tabIndex={-1}
      >
        <div className="text-sm text-timestamps mb-4 ml-[-26px]">
          {iconType === 'link' && <Icon.Link className="inline-block bg-white mr-4 text-black-300" />}
          {iconType === 'image' && <Icon.Image className="inline-block bg-white mr-4 text-black-300" />}
          {iconType === 'text' && <Icon.Text className="inline-block bg-white mr-4 text-black-300" />}
          <Timestamp millis={post.didThisAt} />
        </div>
        <div className="border rounded-lg border-[#dddddd] bg-[#f7f7f7] p-4 grid grid-cols-1 gap-2">

        {post.imageAssetId && (
          <CloudinaryImage
            photoPaperEdge
            lightbox
            assetId={post.imageAssetId}
            intent="post"
            imageMeta={post.imageMeta}
            fullW
          />
        )}
        {post.linkUrl && (
          <LinkPreview linkUrl={post.linkUrl} urlMeta={post.urlMeta} />
        )}
        <p className="break-words whitespace-pre-line">
          {post.description}
        </p>
        {isSelf && (
          <div className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
            <Link
              intent="secondary"
              className="px-4 py-1"
              href={pathBuilder.postEdit(
                authUser.systemSlug,
                post.projectId,
                post.id
              )}
              trackEvent={trackingEvents.bcEditPost}
            >
              Edit update
            </Link>
          </div>
        )}
        </div>
      </div>
    )
  }
)

export default PostCard
