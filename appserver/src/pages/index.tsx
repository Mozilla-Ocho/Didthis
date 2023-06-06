import apiClient from "@/lib/apiClient";
import * as constants from "@/lib/constants";
import type { NextApiRequest } from "next";

import DefaultLayout from "@/components/DefaultLayout";
import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";

import { H, Divider } from "@/components/uiLib";
import { LoginButton } from "@/components/LoginButton";
import { LogoutButton } from "@/components/LogoutButton";

// XXX_SKELETON
const Home = observer(() => {
  const store = useStore();
  console.log("homepage render");
  return (
    <>
      <div>
        <H.H1>product home page</H.H1>
        <p>welcome to the product</p>
      </div>
      <Divider />
      {store.user ? (
        <p>
          logged in as: {store.user.email} <LogoutButton />
        </p>
      ) : (
        <LoginButton />
      )}
      <Divider />
    </>
  );
});

const Wrapper = ({ user, signupCode }: {user: ApiUser | false, signupCode: string | false}) => {
  return (
    <DefaultLayout user={user} signupCode={signupCode}>
      <Home />
    </DefaultLayout>
  );
};

export default Wrapper;

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: {
  req: NextApiRequest;
  resolvedUrl: string;
}) => {
  // DRY_47693 signup code logic
  const url = new URL("http://anyhost.com" + resolvedUrl);
  const signupCode = url.searchParams.get("signupCode") || false;
  let user: ApiUser | false = false;
  const sessionCookie = req.cookies[constants.sessionCookieName];
  if (sessionCookie) {
    user = (
      await apiClient
        .getMe({ sessionCookie, signupCode, expectUnauth: true })
        .catch(() => {
          return { payload: false };
        })
    ).payload as ApiUser | false;
  }
  return {
    props: {
      signupCode,
      user,
    },
  };
};
