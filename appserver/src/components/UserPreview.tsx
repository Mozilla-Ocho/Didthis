import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { CloudinaryImage, H, Link } from './uiLib'
import pathBuilder from '@/lib/pathBuidler'
import { specialAssetIds } from '@/lib/cloudinaryConfig'

const UserPreview = observer(({ user }: { user: ApiUser }) => {
  const store = useStore()
  const isSelf = store.user && store.user.id === user.id
  return (
    <div className="px-4 grid grid-rows-[auto_auto_auto] gap-4">
      {isSelf && (
        <p>
          <Link href={pathBuilder.userEdit(user.systemSlug)}>
            Edit account details
          </Link>
        </p>
      )}
      {user.profile.imageAssetId ? (
        <p className="w-[64px]">
          <CloudinaryImage
            assetId={user.profile.imageAssetId}
            intent="avatar"
          />
        </p>
      ) : (
        <p className="w-[64px]">
          <CloudinaryImage
            assetId={specialAssetIds.defaultAvatarID}
            intent="avatar"
          />
        </p>
      )}
      <H.H5 className="m-0">
        <Link intent="internalNav" href={pathBuilder.user(user.publicPageSlug)}>
          {user.profile.name || 'Unnamed user'}
        </Link>
      </H.H5>
    </div>
  )
})

export default UserPreview
