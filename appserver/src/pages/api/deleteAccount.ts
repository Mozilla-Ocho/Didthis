import type { NextApiRequest, NextApiResponse } from 'next'
import type { EmptySuccessWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import knex from '@/knex'
import Cookies from 'cookies'
import { sessionCookieName } from '@/lib/apiConstants'
// import log from '@/lib/log'

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
  await knex('users')
    .where('id', user.id)
    .del()
  const cookies = new Cookies(req, res, {
    secure: process.env.NEXT_PUBLIC_ENV_NAME !== 'dev',
  })
  cookies.set(sessionCookieName) // set w/ no value to delete
  const wrapper: EmptySuccessWrapper = {
    action: 'deleteAccount',
    status: 200,
    success: true,
  }
  res.status(200).json(wrapper)
}
