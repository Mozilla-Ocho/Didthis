import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import UserProjects from "./UserProjects";
import { Link } from "@/components/uiLib";

const HomeAuth = observer(() => {
  const store = useStore();
  if (!store.user) return <></>; // typescript helper, it doesn't know this component is auth only
  return (
    <>
      <div>
        <Link intent="primary" href={"/user/" + store.user.urlSlug + "/post"}>
          new post
        </Link>
      </div>
      <UserProjects targetUser={store.user} />
    </>
  );
});

export default HomeAuth;
