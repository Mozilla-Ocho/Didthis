import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Divider, Link } from "./uiLib";
// import {LoginButton} from "./auth/LoginButton";

// XXX_SKELETON
const AppHeader = observer(() => {
  const store = useStore();
  return (
    <>
      <div className="container grid grid-cols-3">
        <Link href="/">HOBBYR</Link>
        <div>{store.user ? <Link href={"/user/"+store.user.urlSlug}>{store.user.email}</Link> : ""}</div>
        <div>{store.user ? <LogoutButton /> : ""}</div>
      </div>
      <Divider />
    </>
  );
});

export default AppHeader;
