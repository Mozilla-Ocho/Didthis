import type { NextApiRequest, NextApiResponse } from 'next'
import type { DisconnectDiscordWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import { removeDiscordAccountFromUserProfile } from '@/lib/connectedAccounts/discord'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user] = await getAuthUser(req, res)
  if (!user) {
    const wrapper: ErrorWrapper = {
      action: 'authentication',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    }
    res.status(401).json(wrapper)
    return
  }

  await removeDiscordAccountFromUserProfile(user)

  const wrapper: DisconnectDiscordWrapper = {
    action: 'disconnectDiscord',
    status: 200,
    success: true,
    payload: user,
  }
  res.status(200).json(wrapper)
}
