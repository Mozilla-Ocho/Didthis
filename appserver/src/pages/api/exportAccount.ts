import type { NextApiRequest, NextApiResponse } from 'next'
import knex from '@/knex'
import type { ExportAccountWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import { JobsClient } from '@google-cloud/run'

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
  const millis = new Date().getTime()

  const profile: ApiProfile = {
    ...user.profile,
    exportStatus: {
      state: 'pending',
      jobId: `job-${millis}`,
      requestedAt: new Date().getTime(),
    },
  }
  user.profile = profile

  await knex('users')
    .update({
      last_read_from_user: millis,
      last_write_from_user: millis,
      updated_at_millis: millis,
      profile: profile,
    })
    .where('id', user.id)

  const runClient = new JobsClient()
  await runClient.runJob({
    name: process.env.GCP_EXPORTER_JOB_ID,
    overrides: {
      containerOverrides: [
        {
          args: [user.id],
        },
      ],
    },
  })

  const wrapper: ExportAccountWrapper = {
    action: 'exportAccount',
    status: 200,
    success: true,
    payload: user,
  }
  res.status(200).json(wrapper)
}
