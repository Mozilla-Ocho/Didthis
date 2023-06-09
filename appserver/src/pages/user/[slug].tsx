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
    <DefaultLayout authUser={authUser} signupCode={signupCode} headerFooter="always">
      <UserProjects targetUser={targetUser} />
    </DefaultLayout>
  );
};

export default Wrapper;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // console.time('getServerSideProps-targetUser')
  const indexProps = await indexPageGetServerSideProps(context);
  // now fetch user we're looking at
  let targetUser: ApiUser | false = false;
  if (context.params?.slug) {
    const urlSlug = Array.isArray(context.params.slug)
      ? context.params.slug[0] || ""
      : context.params.slug;
    if (indexProps.props.authUser && indexProps.props.authUser.urlSlug === urlSlug) {
      // self-view. don't use getPublicUser and use the authUser instead.
      // console.log('getServerSideProps-targetUser using auth user')
      targetUser = indexProps.props.authUser
    } else {
      // console.log('getServerSideProps-targetUser fetching other user')
      targetUser = (
        await apiClient.getPublicUser({ urlSlug }).catch(() => {
          // XXX differentiate not found from other errors...
          return { payload: false };
        })
      ).payload as ApiUser | false;
    }
  }
  // console.timeEnd('getServerSideProps-targetUser')
  return { props: {...indexProps.props, targetUser} };
};
