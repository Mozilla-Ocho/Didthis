import {NextApiRequest} from 'next'
import { NextRouter } from 'next/router'

const getParamString = (routerOrReq: NextRouter | NextApiRequest, param: string): string => {
  let x = routerOrReq.query[param]
  x = Array.isArray(x) ? x.join(',') : x
  x = typeof x === 'undefined' ? '' : x
  x = x === null ? '' : x
  return x + ''
}

export { getParamString }
