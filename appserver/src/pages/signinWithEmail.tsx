import { GetServerSidePropsContext } from 'next'
import DefaultLayout from '@/components/DefaultLayout'
import { sessionCookieName } from '@/lib/apiConstants'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'

import SigninWithEmail from '@/components/pages/SignInWithEmail'

const Wrapper = ({
  authUser,
  sessionCookie,
  signupCodeInfo,
  testBucket,
}: {
  authUser: ApiUser | false
  sessionCookie?: string
  signupCodeInfo: ApiSignupCodeInfo | false
  testBucket: TestBucket
}) => {
  return (
    <DefaultLayout
      hideLogin
      authUser={authUser}
      signupCodeInfo={signupCodeInfo}
      unauthHomepage={!authUser}
      testBucket={testBucket}
    >
      <SigninWithEmail sessionCookie={sessionCookie} />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const indexProps = await indexPageGetServerSideProps(context)
  const sessionCookie = context.req.cookies[sessionCookieName] || null
  return {
    props: {
      ...indexProps.props,
      sessionCookie,
    },
  }
}
