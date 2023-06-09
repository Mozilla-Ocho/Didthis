// import pathBuilder from "@/lib/pathBuidler";
import { observer } from "mobx-react-lite";
import { Timestamp } from "./uiLib";

const PostCard = observer(
  ({ post, targetUser }: { post: ApiPost; targetUser: ApiUser }) => {
    return (
      <div className="border p-4">
        <p>{post.description}</p>
        <p><Timestamp seconds={post.createdAt}/></p>
      </div>
    );
  }
);

export default PostCard;

