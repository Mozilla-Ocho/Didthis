import type { NextApiRequest, NextApiResponse } from 'next'
import type { ValidateSignupCodeWrapper } from '@/lib/apiConstants'
import { signupCodes } from '@/lib/apiConstants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = (req.query.code || '') + ''
  // DRY_47693 signup code logic
  const data = signupCodes[code]
  if (data && data.active) {
    const wrapper: ValidateSignupCodeWrapper = {
      action: 'validateSignupCode',
      status: 200,
      success: true,
      payload: {
        code,
        name: data.name,
        active: data.active,
      },
    }
    res.status(200).json(wrapper)
  } else {
    const wrapper: ValidateSignupCodeWrapper = {
      action: 'validateSignupCode',
      status: 200,
      success: true,
      payload: {
        code,
        name: 'unknown',
        active: false,
      },
    }
    res.status(200).json(wrapper)
  }
}
