import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { CloudinaryImage, H, Link } from './uiLib'
import pathBuilder from '@/lib/pathBuidler'
import { specialAssetIds } from '@/lib/cloudinaryConfig'

const UserPreview = observer(({ user }: { user: ApiUser }) => {
  const store = useStore()
  const isSelf = store.user && store.user.id === user.id
  return (
    <div className="p-4">
      {isSelf && (
        <p>
          <Link href={pathBuilder.userEdit(user.systemSlug)}>
            edit account details
          </Link>
        </p>
      )}
      {user.profile.imageAssetId ? (
        <div className="w-[100px]">
          <CloudinaryImage
            assetId={user.profile.imageAssetId}
            intent="avatar"
          />
        </div>
      ) : (
        <div className="w-[100px]">
          <CloudinaryImage
            assetId={specialAssetIds.defaultAvatarID}
            intent="avatar"
          />
        </div>
      )}
      <H.H5>
        <Link intent="internalNav" href={pathBuilder.user(user.publicPageSlug)}>
          {user.profile.name || 'Unnamed user'}
        </Link>
      </H.H5>
    </div>
  )
})

export default UserPreview
