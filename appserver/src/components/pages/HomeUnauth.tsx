import { H, Divider } from "@/components/uiLib";
import { LoginButton } from "@/components/auth/LoginButton";

// XXX_SKELETON
const HomeUnauth = () => {
  return (
    <>
      <div>
        <H.H1>product home page</H.H1>
        <p>welcome to the product</p>
      </div>
      <Divider />
        <LoginButton />
      <Divider />
    </>
  );
}

export default HomeUnauth;


