import knex from '@/knex'

const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10'

export async function fetchDiscordAccountWithOAuthCode(
  redirectUri: string,
  code: string
): Promise<DiscordAccount> {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const authB64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch(`${DISCORD_API_ENDPOINT}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Basic ${authB64}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  })
  if (200 !== res.status) {
    const body = await res.text()
    throw new Error(
      `failed to exchange code for access token ${res.status} - ${body}`
    )
  }

  const { access_token, refresh_token, expires_in } = await res.json()
  if (!access_token) {
    throw new Error('access_token not provided by server')
  }

  const resMe = await fetch(`${DISCORD_API_ENDPOINT}/oauth2/@me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  if (200 !== resMe.status) {
    throw new Error('failed to fetch user identity from discord')
  }

  const discordUser = await resMe.json()
  const {
    user: {
      id,
      username,
      email = null,
      avatar,
      discriminator,
      global_name: globalName,
    },
  } = discordUser
  if (!id) {
    throw new Error('user fetched from discord missing expected data')
  }

  return {
    id,
    username,
    email,
    avatar,
    discriminator,
    globalName,
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresIn: expires_in,
  }
}

export async function addDiscordAccountToUserProfile(
  user: ApiUser,
  discordAccount: DiscordAccount
) {
  const profile: ApiProfile = {
    ...user.profile,
    connectedAccounts: {
      discord: discordAccount,
    },
  }
  user.profile = profile

  const millis = new Date().getTime()
  return knex('users')
    .update({
      last_read_from_user: millis,
      last_write_from_user: millis,
      updated_at_millis: millis,
      profile: profile,
    })
    .where('id', user.id)
}

export async function removeDiscordAccountFromUserProfile(user: ApiUser) {
  if (!user.profile.connectedAccounts?.discord) return

  // Revise profile to omit discord account
  const { discord, ...otherAccounts } = user.profile.connectedAccounts
  const profile: ApiProfile = {
    ...user.profile,
    connectedAccounts: {
      ...otherAccounts,
    },
  }
  user.profile = profile

  const millis = new Date().getTime()
  return knex('users')
    .update({
      last_read_from_user: millis,
      last_write_from_user: millis,
      updated_at_millis: millis,
      profile: profile,
    })
    .where('id', user.id)
}
