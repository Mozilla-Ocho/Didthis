import DefaultLayout from "@/components/DefaultLayout";
import { getServerSideProps as indexPageGetServerSideProps } from "@/pages/index";
import apiClient from "@/lib/apiClient";
import UserProjects from "@/components/pages/UserProjects";
import { GetServerSidePropsContext } from "next";

const Wrapper = ({
  authUser,
  signupCode,
  targetUser,
}: {
  authUser: ApiUser | false;
  signupCode: string | false;
  targetUser: ApiUser | false;
}) => {
  return (
    <DefaultLayout authUser={authUser} signupCode={signupCode} headerFooter={true}>
      <UserProjects targetUser={targetUser} />
    </DefaultLayout>
  );
};

export default Wrapper;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const indexProps = await indexPageGetServerSideProps(context);
  // now fetch user we're looking at
  let targetUser: ApiUser | false = false;
  if (context.params?.slug) {
    const urlSlug = Array.isArray(context.params.slug)
      ? context.params.slug[0] || ""
      : context.params.slug;
    targetUser = (
      await apiClient.getPublicUser({ urlSlug }).catch(() => {
        // XXX differentiate not found from other errors...
        return { payload: false };
      })
    ).payload as ApiUser | false;
  }
  return { props: {...indexProps.props, targetUser} };
};
