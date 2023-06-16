// import pathBuilder from "@/lib/pathBuidler";
import { observer } from 'mobx-react-lite'
import { Timestamp, CloudinaryImage, Link,Button } from './uiLib'
import pathBuilder from '@/lib/pathBuidler'
import LinkPreview from './LinkPreview'
import {useStore} from '@/lib/store'

const PostCard = observer(
  ({
    post,
    authUser,
    targetUser,
    focused,
  }: {
    post: ApiPost
    authUser: ApiUser | false,
    targetUser: ApiUser
    focused: boolean
  }) => {
    const isSelf = (authUser && authUser.id === targetUser.id)
    const store = useStore()
    return (
      <div className={`border p-4 ${focused ? 'border-4 bg-slate-50' : ''}`}>
        {isSelf && <p><Link href={pathBuilder.postEdit(authUser.urlSlug, post.projectId, post.id)}>edit</Link></p>}
        {isSelf && <p><Button onClick={()=>store.promptDeletePost(post)}>delete</Button></p>}
        {post.imageAssetId && <CloudinaryImage assetId={post.imageAssetId} intent="post"/>}
        <p>{post.description}</p>
        {post.linkUrl && <LinkPreview linkUrl={post.linkUrl} urlMeta={post.urlMeta} />}
        <p>
          created <Timestamp millis={post.createdAt} />
        </p>
        <p>
          updated <Timestamp millis={post.updatedAt} />
        </p>
      </div>
    )
  }
)

export default PostCard
