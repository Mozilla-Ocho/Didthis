import knex from "@/knex";
import {H,Button,Divider} from '@/components/uiLib';
import {StoreWrapper} from '@/lib/store';
import {LoginButton} from '@/components/LoginButton';
import {LoginGlobalOverlay} from '@/components/LoginGlobalOverlay';

export default function Home({ dbResult }: { dbResult: string }) {
  console.log("homepage render")
  return (
    <StoreWrapper>
      <LoginGlobalOverlay />
      <main className="p-10">
        <div>
          <H.H1>product home page</H.H1>
          <p>welcome to the product</p>
        </div>
        <Divider/>
        <LoginButton />
        <Divider/>
      </main>
    </StoreWrapper>
  );
}

