// import pathBuilder from "@/lib/pathBuidler";
import { observer } from 'mobx-react-lite'
import { Timestamp, CloudinaryImage } from './uiLib'

const PostCard = observer(
  // XXX focused should scroll
  ({
    post,
    targetUser,
    focused,
  }: {
    post: ApiPost
    targetUser: ApiUser
    focused: boolean
  }) => {
    return (
      <div className={`border p-4 ${focused ? 'border-4 bg-slate-50' : ''}`}>
        {post.imageAssetId && <CloudinaryImage assetId={post.imageAssetId} intent="post"/>}
        <p>{post.description}</p>
        <p>
          created <Timestamp seconds={post.createdAt} />
        </p>
        <p>
          updated <Timestamp seconds={post.updatedAt} />
        </p>
      </div>
    )
  }
)

export default PostCard
