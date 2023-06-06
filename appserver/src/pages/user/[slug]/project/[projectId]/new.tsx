import { useRouter } from 'next/router';

import DefaultLayout from "@/components/DefaultLayout";
import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import { getServerSideProps as indexPageGetServerSideProps } from "@/pages/index";

import { H } from "@/components/uiLib";
import LoginBouncer from '@/components/auth/LoginBouncer';
import PostForm from '@/components/forms/PostForm';

// XXX_SKELETON

const NewPost = observer(() => {
  const store = useStore();
  const router = useRouter();
  if (!store.user) return <LoginBouncer/>
  return (
    <>
      <div>
        <H.H1>new post for user {router.query.slug} in project {router.query.projectId}</H.H1>
        <PostForm />
      </div>
    </>
  );
});

const Wrapper = ({ authUser, signupCode }: {authUser: ApiUser | false, signupCode: string | false}) => {
  return (
    <DefaultLayout authUser={authUser} signupCode={signupCode} headerFooter={true}>
      <NewPost />
    </DefaultLayout>
  );
};

export default Wrapper;

export const getServerSideProps = indexPageGetServerSideProps



