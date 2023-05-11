import knex from "@/knex";
import { H, Button, Divider } from "@/components/uiLib";
import { StoreWrapper, StoreReadinessWrapper } from "@/lib/store";
import { LoginButton } from "@/components/LoginButton";
import { LoginGlobalOverlay } from "@/components/LoginGlobalOverlay";
import {NextRequest} from "next/server";

export default function Home({ nextURL }: { nextURL: string }) {
  console.log("homepage render");
  return (
    <StoreWrapper nextURL={nextURL}>
      <StoreReadinessWrapper ifNotReady={<p>"loading"</p>}>
        <LoginGlobalOverlay />
        <main className="p-10">
          <div>
            <H.H1>product home page</H.H1>
            <p>welcome to the product</p>
          </div>
          <Divider />
          <LoginButton />
          <Divider />
        </main>
      </StoreReadinessWrapper>
    </StoreWrapper>
  );
}

export function getServerSideProps({
  // req,
  resolvedUrl,
}: {
  // req: NextRequest;
  resolvedUrl: string;
}) {
  return {
    props: {
      // protocol and domain don't matter right now, this value is for getting
      // path and query params 
      nextURL: "http://XXX_PORTING"+resolvedUrl
      // resolvedUrl
    },
  };
}
