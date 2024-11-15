import type { NextApiRequest, NextApiResponse } from 'next'
import type { ErrorWrapper, PublicUserWrapper } from '@/lib/apiConstants'
import knex from '@/knex'
import { userFromDbRow } from '@/lib/serverAuth'
import { getParamString } from '@/lib/nextUtils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const urlSlug = getParamString(req, 'urlSlug')
  const dbRow = (await knex('users')
    .where('user_slug_lc', urlSlug.toLowerCase())
    .orWhere('system_slug', urlSlug)
    .first()) as UserDbRow | undefined
  if (dbRow) {
    // this api returns public data only even if requested by the owner of that data.
    const user: ApiUser = userFromDbRow(dbRow, { publicFilter: true })
    if (!user.isFlagged) {
      const wrapper: PublicUserWrapper = {
        action: 'publicUser',
        status: 200,
        success: true,
        payload: user,
      }
      res.status(200).json(wrapper)
      return
    }
  }
  const wrapper: ErrorWrapper = {
    action: 'publicUser',
    status: 404,
    success: false,
    errorId: 'ERR_NOT_FOUND',
    errorMsg: 'user not found',
  }
  res.status(404).json(wrapper)
}
