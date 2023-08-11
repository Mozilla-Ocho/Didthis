import apiClient from '@/lib/apiClient'
import DefaultLayout from '@/components/DefaultLayout'
import Home from '@/components/pages/Home'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { sessionCookieName, csrfCookieName } from '@/lib/apiConstants'
import { getAuthUser, getValidCodeInfo } from '@/lib/serverAuth';
// import log from '@/lib/log'

const Wrapper = ({
  authUser,
  signupCodeInfo,
  testBucket,
}: {
  authUser: ApiUser | false
  signupCodeInfo: ApiSignupCodeInfo | false
  testBucket: TestBucket,
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
      signupCodeInfo={signupCodeInfo}
      unauthHomepage={!authUser}
      testBucket={testBucket}
    >
      <Home />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // DRY_47693 signup code logic
  const url = new URL('http://anyhost.com' + context.resolvedUrl)
  const signupCode = url.searchParams.get('signupCode') || false
  const signupCodeInfo = signupCode ? getValidCodeInfo(signupCode) : false
  let authUser: ApiUser | false = false
  const sessionCookie = context.req.cookies[sessionCookieName]
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const testBucket = (context.req as any)._testBucket as TestBucket
  if (sessionCookie) {
    // in SSR, we call getAuthUser directly, forcibly coercing the
    // NextApiRequest-ish context.req object and NextApiResponse-ish
    // context.req objects. the coercion works for our use case in
    // getAuthUser, which is about reading/writing cookies, not
    // request content that doesn't have the same interface. otherwise, if we
    // made a fetch call to the api, it would be slower and also we couldn't
    // set cookies.
    [authUser] = await getAuthUser(context.req as NextApiRequest, context.res as NextApiResponse)
  }
  return {
    props: {
      signupCodeInfo,
      authUser,
      testBucket,
    },
  }
}
