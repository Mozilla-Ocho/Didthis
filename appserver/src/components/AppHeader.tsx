import {observer} from "mobx-react-lite"
import { useStore } from "@/lib/store";
import { LogoutButton } from "@/components/auth/LogoutButton";

// XXX_SKELETON
const AppHeader = observer(() => {
  const store = useStore()
  return (
    <div>
      <hr/>
      app header.
      {store.user && <span>{store.user.email} <LogoutButton /></span> }
      <hr/>
    </div>
  );
})

export default AppHeader
