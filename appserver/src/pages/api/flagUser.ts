import type { NextApiRequest, NextApiResponse } from 'next'
import type { ErrorWrapper, EmptySuccessWrapper } from '@/lib/apiConstants'
import knex from '@/knex'
import { getAuthUser } from '@/lib/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const [authUser] = await getAuthUser(req, res)
  if (!authUser || !authUser.isAdmin) {
    const wrapper: ErrorWrapper = {
      action: 'flagUser',
      status: 403,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    }
    res.status(403).json(wrapper)
    return
  }
  const flagged = req.body.flagged as boolean
  if (typeof flagged !== 'boolean') {
    const wrapper: ErrorWrapper = {
      action: 'flagUser',
      status: 400,
      success: false,
      errorId: 'ERR_BAD_INPUT',
      errorMsg: 'flagged must be boolean',
    }
    res.status(400).json(wrapper)
    return
  }
  const uid = req.body.userId as ApiUserId
  const dbRow = (await knex('users')
    .where('id', uid)
    .first()) as UserDbRow | undefined
  if (!dbRow) {
    const wrapper: ErrorWrapper = {
      action: 'flagUser',
      status: 404,
      success: false,
      errorId: 'ERR_NOT_FOUND',
      errorMsg: 'user not found',
    }
    res.status(400).json(wrapper)
    return
  }
  if (dbRow.admin_status === 'admin') {
    const wrapper: ErrorWrapper = {
      action: 'flagUser',
      status: 400,
      success: false,
      errorId: 'ERR_BAD_INPUT',
      errorMsg: 'cant flag an admin',
    }
    res.status(400).json(wrapper)
    return
  }
  const millis = new Date().getTime()
  await knex('users')
    .update({
      ban_status: flagged ? 'flagged' : null,
      updated_at_millis: millis,
    })
    .where('id', dbRow.id)
  const wrapper: EmptySuccessWrapper = {
    action: 'flagUser',
    status: 200,
    success: true,
  }
  res.status(200).json(wrapper)
}

