import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { CloudinaryImage, H, Link } from './uiLib'
import pathBuilder from '@/lib/pathBuilder'
import { specialAssetIds } from '@/lib/cloudinaryConfig'

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
          <p className="w-16">
            <CloudinaryImage
              assetId={user.profile.imageAssetId}
              intent="avatar"
            />
          </p>
        ) : (
          <p className="w-16">
            <CloudinaryImage
              assetId={specialAssetIds.defaultAvatarID}
              intent="avatar"
            />
          </p>
        )}
        <H.H5 className="m-0">{user.profile.name || 'Unnamed user'}</H.H5>
      </div>
    )
  }
)

export default UserPreview
