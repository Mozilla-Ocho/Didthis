import DefaultLayout from "@/components/DefaultLayout";
import { getServerSideProps as userPageGetServerSideProps } from "@/pages/user/[slug]";
import ProjectPage from '@/components/pages/Project';
import NotFound from "@/components/pages/NotFound";

const Wrapper = ({
  authUser,
  signupCode,
  targetUser,
}: {
  authUser: ApiUser | false;
  signupCode: string | false;
  targetUser: ApiUser | false;
}) => {
  if (!targetUser) return <NotFound/>
  return (
    <DefaultLayout authUser={authUser} signupCode={signupCode} headerFooter="always">
      <ProjectPage targetUser={targetUser} />
    </DefaultLayout>
  );
};

export default Wrapper;

export const getServerSideProps = userPageGetServerSideProps


