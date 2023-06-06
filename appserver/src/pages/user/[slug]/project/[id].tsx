import { useRouter } from 'next/router';

import DefaultLayout from "@/components/DefaultLayout";
import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import { getServerSideProps as indexPageGetServerSideProps } from "@/pages/index";

import { H } from "@/components/uiLib";
import UserPreview from '@/components/UserPreview';

// XXX_SKELETON

const Project = observer(() => {
  const store = useStore();
  const router = useRouter();
  const fakeUser = {
    id: 1234,
  }
  return (
    <>
      <div>
        <H.H1>project detail (id={router.query.id}) for user {router.query.slug}</H.H1>
        <UserPreview user={fakeUser} />
        <em>current auth uid: {store.user?.id || 'none'}</em>
      </div>
    </>
  );
});

const Wrapper = ({ user, signupCode }: {user: ApiUser | false, signupCode: string | false}) => {
  return (
    <DefaultLayout user={user} signupCode={signupCode}>
      <Project />
    </DefaultLayout>
  );
};

export default Wrapper;

export const getServerSideProps = indexPageGetServerSideProps


