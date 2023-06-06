import { useEffect } from "react";
import { H, Divider } from "@/components/uiLib";
import { LoginButton } from "@/components/LoginButton";
import { LogoutButton } from "@/components/LogoutButton";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import DefaultLayout from "@/components/DefaultLayout";
import { useStore } from "@/lib/store";

type props = {
  nextURL: string;
};

const Home: NextPageWithLayout<props> = ({ nextURL }: props) => {
  const store = useStore();
  useEffect(() => {
    // we can't pass next's url to the store at boot, because that happens in
    // the layout, and the layout doesn't support getServerSideProps. so we
    // do it here, and lazy-boot the logic around checking the url for signupCode
    store.setNextURL(nextURL);
  }, [store, nextURL]);
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
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Home;

export function getServerSideProps({ resolvedUrl }: { resolvedUrl: string }) {
  return {
    props: {
      // protocol and domain don't matter right now, this value is for getting
      // path and query params
      // maybe try https://github.com/jakeburden/next-absolute-url
      nextURL: "http://XXX_PORTING" + resolvedUrl,
    },
  };
}
