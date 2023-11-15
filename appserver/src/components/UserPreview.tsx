import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { CloudinaryImage, Link } from './uiLib'
import pathBuilder from '@/lib/pathBuilder'
import { specialAssetIds } from '@/lib/cloudinaryConfig'
import profileUtils from '@/lib/profileUtils'
import Image from 'next/image'
import twIcon from '@/assets/img/twitter_2x.png'
import rdIcon from '@/assets/img/reddit_2x.png'
import fbIcon from '@/assets/img/facebook_2x.png'
import igIcon from '@/assets/img/instagram_2x.png'

export const UserAvatar = observer(({ user }: { user: ApiUser }) => {
  const store = useStore()
  return user.profile.imageAssetId ? (
    <CloudinaryImage assetId={user.profile.imageAssetId} intent="avatar" />
  ) : (
    <CloudinaryImage
      assetId={specialAssetIds.defaultAvatarID}
      intent="avatar"
    />
  )
})

const UserPreview = observer(
  ({ user, compact }: { user: ApiUser; compact: boolean }) => {
    const store = useStore()
    const isSelf = store.user && store.user.id === user.id
    if (compact) {
      return (
        <div className="flex flex-row gap-2 items-center">
          <p className="w-8">
            <UserAvatar user={user} />
          </p>
          <p className="m-0 text-sm">
            <Link
              intent="internalNav"
              className="no-underline font-bold text-sm text-yellow-600"
              href={pathBuilder.user(user.publicPageSlug)}
            >
              {user.profile.name || 'Unnamed user'}
            </Link>
          </p>
        </div>
      )
    }
    return (
      <div className="grid grid-rows-[auto_auto_auto] gap-4">
        {isSelf && !user.isTrial && (
          <p>
            <Link href={pathBuilder.userEdit(user.systemSlug)}>
              Edit account details
            </Link>
          </p>
        )}
        {user.profile.imageAssetId ? (
          <p className="w-16 sm:w-32">
            <CloudinaryImage
              assetId={user.profile.imageAssetId}
              intent="avatar"
            />
          </p>
        ) : (
          <p className="w-16 sm:w-32">
            <CloudinaryImage
              assetId={specialAssetIds.defaultAvatarID}
              intent="avatar"
            />
          </p>
        )}
        <h5 className="m-0">{user.profile.name || 'Unnamed user'}</h5>
        {user.profile.bio && (
          <p className="text-md text-bodytext my2 break-words whitespace-pre-line">
            {user.profile.bio}
          </p>
        )}
        {/* the second condition here is logically superfluous but needed to
      suppress typescript errors */}
        {profileUtils.hasAnySocialUrls(user.profile) &&
          user.profile.socialUrls && (
            <>
              <p className="text-form-labels text-sm mt-4 mb-0">Find me on:</p>
              <div className="flex flex-row gap-x-8 gap-y-4 w-[90%] flex-wrap">
                {user.profile.socialUrls.twitter && (
                  <p className="whitespace-nowrap">
                    <Image
                      src={twIcon}
                      alt="Twitter icon"
                      className='w-auto h-8 inline mr-2'
                    />
                    <Link external href={user.profile.socialUrls.twitter}>
                      Twitter
                    </Link>
                  </p>
                )}
                {user.profile.socialUrls.facebook && (
                  <p className="whitespace-nowrap">
                    <Image
                      src={fbIcon}
                      alt="Facebook icon"
                      className='w-auto h-8 inline mr-2'
                    />
                    <Link external href={user.profile.socialUrls.facebook}>
                      Facebook
                    </Link>
                  </p>
                )}
                {user.profile.socialUrls.reddit && (
                  <p className="whitespace-nowrap">
                    <Image
                      src={rdIcon}
                      alt="Reddit icon"
                      className='w-auto h-8 inline mr-2'
                    />
                    <Link external href={user.profile.socialUrls.reddit}>
                      Reddit
                    </Link>
                  </p>
                )}
                {user.profile.socialUrls.instagram && (
                  <p className="whitespace-nowrap">
                    <Image
                      src={igIcon}
                      alt="Instagram icon"
                      className='w-auto h-8 inline mr-2'
                    />
                    <Link external href={user.profile.socialUrls.instagram}>
                      Instagram
                    </Link>
                  </p>
                )}
              </div>
            </>
          )}
      </div>
    )
  }
)

export default UserPreview
