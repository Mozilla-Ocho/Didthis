import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { CloudinaryImage, Link } from './uiLib'
import pathBuilder from '@/lib/pathBuilder'
import { specialAssetIds } from '@/lib/cloudinaryConfig'
import profileUtils from '@/lib/profileUtils'

const UserPreview = observer(
  ({ user, compact }: { user: ApiUser; compact: boolean }) => {
    const store = useStore()
    const isSelf = store.user && store.user.id === user.id
    if (compact) {
      return (
        <div className="flex flex-row gap-4 items-center">
          {user.profile.imageAssetId ? (
            <p className="w-8">
              <CloudinaryImage
                assetId={user.profile.imageAssetId}
                intent="avatar"
              />
            </p>
          ) : (
            <p className="w-8">
              <CloudinaryImage
                assetId={specialAssetIds.defaultAvatarID}
                intent="avatar"
              />
            </p>
          )}
          <p className="m-0 text-sm">
            <Link
              intent="internalNav"
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
        {isSelf && (
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
              <div className="flex flex-row gap-8 justify-between w-[90%]">
                {user.profile.socialUrls.twitter && (
                  <p className="">
                    <Link external href={user.profile.socialUrls.twitter}>
                      Twitter
                    </Link>
                  </p>
                )}
                {user.profile.socialUrls.facebook && (
                  <p className="">
                    <Link external href={user.profile.socialUrls.facebook}>
                      Facebook
                    </Link>
                  </p>
                )}
                {user.profile.socialUrls.reddit && (
                  <p className="">
                    <Link external href={user.profile.socialUrls.reddit}>
                      Reddit
                    </Link>
                  </p>
                )}
                {user.profile.socialUrls.instagram && (
                  <p className="">
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
