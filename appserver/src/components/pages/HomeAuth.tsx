import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import UserProjects from "./UserProjects";

const HomeAuth = observer(() => {
  const store = useStore();
  return <UserProjects targetUser={store.user} />
});

export default HomeAuth;
