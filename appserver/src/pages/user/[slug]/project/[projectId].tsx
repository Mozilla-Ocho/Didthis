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
    id: 'asdf',
    email: 'foo@bar.com',
    createdAt: new Date().getTime(),
    profile: {}
  }
  return (
    <>
      <div>
        <H.H1>project detail (id={router.query.projectId}) for user {router.query.slug}</H.H1>
        <UserPreview user={fakeUser} />
      </div>
    </>
  );
});

const Wrapper = ({ authUser, signupCode }: {authUser: ApiUser | false, signupCode: string | false}) => {
  return (
    <DefaultLayout authUser={authUser} signupCode={signupCode} headerFooter="always">
      <Project />
    </DefaultLayout>
  );
};

export default Wrapper;

export const getServerSideProps = indexPageGetServerSideProps


