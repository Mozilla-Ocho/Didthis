import type { NextApiRequest, NextApiResponse } from 'next'
import type { ValidateSignupCodeWrapper } from '@/lib/apiConstants'
import { getValidCodeInfo } from '@/lib/serverAuth';
import {getParamString} from '@/lib/nextUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userCode = getParamString(req,'code')
  // DRY_47693 signup code logic
  const validCode = getValidCodeInfo(userCode)
  if (validCode) {
    const wrapper: ValidateSignupCodeWrapper = {
      action: 'validateSignupCode',
      status: 200,
      success: true,
      payload: {
        code: userCode,
        name: validCode.name,
        active: validCode.active,
      },
    }
    res.status(200).json(wrapper)
  } else {
    const wrapper: ValidateSignupCodeWrapper = {
      action: 'validateSignupCode',
      status: 200,
      success: true,
      payload: {
        code: userCode,
        name: 'unknown',
        active: false,
      },
    }
    res.status(200).json(wrapper)
  }
}
