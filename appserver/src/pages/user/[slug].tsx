import { useRouter } from 'next/router';

import DefaultLayout from "@/components/DefaultLayout";
import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import { getServerSideProps as indexPageGetServerSideProps } from "@/pages/index";

import { H } from "@/components/uiLib";

// XXX_SKELETON
const Projects = observer(() => {
  const store = useStore();
  const router = useRouter();
  return (
    <>
      <div>
        <H.H1>projects for user {router.query.slug}</H.H1>
        <p>current auth uid: {store.user?.id || 'none'}</p>
      </div>
    </>
  );
});


const Wrapper = ({ user, signupCode }: {user: ApiUser | false, signupCode: string | false}) => {
  return (
    <DefaultLayout user={user} signupCode={signupCode}>
      <Projects />
    </DefaultLayout>
  );
};

export default Wrapper;

export const getServerSideProps = indexPageGetServerSideProps

