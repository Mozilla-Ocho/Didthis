import apiClient from '@/lib/apiClient'
import DefaultLayout from '@/components/DefaultLayout'
import Home from '@/components/pages/Home'
import { GetServerSidePropsContext } from 'next'
import { sessionCookieName, csrfCookieName } from '@/lib/apiConstants'
import { getValidCodeInfo } from '@/lib/serverAuth';
// import log from '@/lib/log'

const Wrapper = ({
  authUser,
  signupCodeInfo,
}: {
  authUser: ApiUser | false
  signupCodeInfo: ApiSignupCodeInfo | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
      signupCodeInfo={signupCodeInfo}
      unauthHomepage={!authUser}
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
  const csrfCookie = context.req.cookies[csrfCookieName]

  if (sessionCookie) {
    authUser = (
      await apiClient
        .getMe({ sessionCookie, csrfCookie, signupCode, expectUnauth: true })
        .catch(() => {
          return { payload: false }
        })
    ).payload as ApiUser | false
  }
  return {
    props: {
      signupCodeInfo,
      authUser,
    },
  }
}
