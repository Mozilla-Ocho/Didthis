import apiClient from '@/lib/apiClient'
import DefaultLayout from '@/components/DefaultLayout'
import Home from '@/components/pages/Home'
import { GetServerSidePropsContext } from 'next'
import { sessionCookieName, csrfCookieName } from '@/lib/apiConstants'
// import log from '@/lib/log'

const Wrapper = ({
  authUser,
  signupCode,
}: {
  authUser: ApiUser | false
  signupCode: string | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
      signupCode={signupCode}
      skipLayout={!authUser}
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
      signupCode,
      authUser,
    },
  }
}
