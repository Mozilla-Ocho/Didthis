import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import UserProjects from "./UserProjects";
import { Link } from "@/components/uiLib";
import pathBuilder from "@/lib/pathBuidler";

const HomeAuth = observer(() => {
  const store = useStore();
  if (!store.user) return <></>; // typescript helper, it doesn't know this component is auth only
  return (
    <>
      <div>
        <Link intent="primary" href={pathBuilder.newPost(store.user.urlSlug)}>
          new post
        </Link>
      </div>
      <UserProjects targetUser={store.user} />
    </>
  );
});

export default HomeAuth;
