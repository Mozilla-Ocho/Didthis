import type { NextApiRequest, NextApiResponse } from 'next'
import type { ErrorWrapper, PublicUserWrapper } from '@/lib/apiConstants'
import knex from '@/knex'
import { userFromDbRow } from '@/lib/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const urlSlug = req.query.urlSlug || ''
  const dbRow = (await knex('users').where('url_slug', urlSlug).first()) as
    | UserDbRow
    | undefined
  if (dbRow) {
    // this api returns public data only even if requested by the owner of that data.
    const user: ApiUser = userFromDbRow(dbRow, { publicFilter: true })
    const wrapper: PublicUserWrapper = {
      action: 'getUser',
      status: 200,
      success: true,
      payload: user,
    }
    res.status(200).json(wrapper)
  } else {
    const wrapper: ErrorWrapper = {
      action: 'getUser',
      status: 404,
      success: false,
      errorId: 'ERR_NOT_FOUND',
      errorMsg: 'user not found',
    }
    res.status(404).json(wrapper)
  }
}
