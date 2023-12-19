import DefaultLayout from '@/components/DefaultLayout'
import { sessionCookieName } from '@/lib/apiConstants'
import pathBuilder from '@/lib/pathBuilder'

import { getAuthUser } from '@/lib/serverAuth'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import {
  fetchDiscordAccountWithOAuthCode,
  addDiscordAccountToUserProfile,
} from '@/lib/connectedAccounts/discord'

const csrfCookieName = '_h3y_csrf' // DRY_86325 crsf cookie name. TODO: put this in a non-typescript shared const file?

const ConnectDiscord = ({ authUser }: { authUser: ApiUser | false }) => {
  // This component should never really end up being visible because
  // gerServerSideProps is full of redirects & 404s
  return (
    <DefaultLayout authUser={authUser}>
      <p>Connecting to Discord...</p>
    </DefaultLayout>
  )
}

export default ConnectDiscord

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { params, query, req, res } = context

  // Check for current auth user, or bail out
  let authUser: ApiUser | false = false
  const sessionCookie = req.cookies[sessionCookieName]
  if (sessionCookie) {
    const res = await getAuthUser(
      context.req as NextApiRequest,
      context.res as NextApiResponse
    )
    authUser = res[0]
  }
  if (!authUser) {
    return { notFound: true }
  }

  // Attempt to fetch the discord account and update the user's profile
  let connectError = null
  try {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    if (!clientId) throw new Error('Discord client not configured')

    const code = query.code || null
    if (!code || typeof code !== 'string')
      throw new Error('Authorization request was rejected')

    const state = query.state || null
    const csrfCookie = req.cookies[csrfCookieName] || ''
    if (state !== csrfCookie) throw new Error('CSRF token mismatch')

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const host = req.headers.host
    const baseUrl = new URL(`${protocol}://${host}`)
    const redirectUri = new URL(`/connect/discord`, baseUrl).toString()

    const discordAccount = await fetchDiscordAccountWithOAuthCode(
      redirectUri,
      code
    )

    await addDiscordAccountToUserProfile(authUser, discordAccount)
  } catch (error) {
    connectError = (error as Error).message
    console.error('Failed to connect to discord', connectError)
    // TODO: report an error to the user, here?
  }

  // Bounce back to discord button in user edit form after all the above
  const userEditPath = pathBuilder.userEdit(authUser.systemSlug)
  return {
    redirect: {
      destination: `${userEditPath}#connect-discord-account`,
    },
  }
}
