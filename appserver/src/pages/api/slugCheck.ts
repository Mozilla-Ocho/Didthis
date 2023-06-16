import type { NextApiRequest, NextApiResponse } from 'next'
import type { SlugCheckWrapper, ErrorWrapper } from '@/lib/apiConstants'
import { getAuthUser } from '@/lib/serverAuth'
import knex from '@/knex'
import profileUtils from '@/lib/profileUtils'
import { isReserved } from '@/lib/reservedSlugs'
import { getParamString } from '@/lib/nextUtils'

const checkAvailability = async (
  checkSlug: string,
  user: ApiUser
): Promise<SlugCheck> => {
  checkSlug = checkSlug.trim()
  if (checkSlug === user.urlSlug) {
    // it's their own slug. is it "available"? let's say yes because it's
    // easier for logic: we don't render an error and we allow the user
    // to click save, etc.
    return {
      value: checkSlug,
      available: true,
      valid: true,
    }
  }
  const validation = profileUtils.slugStringValidation(checkSlug)
  if (validation.valid) {
    if (isReserved(checkSlug)) {
      // TODO given the reserved slug rules, it is potentially bad UX to not
      // tell the user what's wrong with their slug, they may quickly get
      // frustrated guessing why it's not "available", even if they keep
      // adding arbitrary numbers or making changes to it.
      return {
        value: checkSlug,
        available: false,
        valid: true,
        errorConst: 'ERR_SLUG_UNAVAILABLE',
      }
    } else {
      const found = await knex('users')
        .where('url_slug', checkSlug)
        .returning('*')
        .first()
      if (found) {
        return {
          value: checkSlug,
          available: false,
          valid: true,
          errorConst: 'ERR_SLUG_UNAVAILABLE',
        }
      } else {
        return {
          value: checkSlug,
          available: true,
          valid: true,
        }
      }
    }
  } else {
    return {
      value: checkSlug,
      available: false,
      valid: false,
      errorConst: validation.error,
    }
  }
}

const getSuggestedSlug = async (user: ApiUser): Promise<string> => {
  const name = (user.profile.name || '').trim()
  let slug = name
  if (!slug) {
    // no name? empty suggestion
    return ''
  }
  // convert "foo bar baz" to "FooBarBaz" and then replace "F" with "f" (the
  // users first letter case is preserved)
  slug = slug.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
  })
  slug = name.charAt(0) + slug.substring(1)
  slug = slug.replace(/\s/g, '')
  // add '', 2, 3 onto the slug until we have a good one, up to 20
  let extraNumber = 1
  while (extraNumber <= 20) {
    const check = slug + (extraNumber > 1 ? extraNumber : '')
    const slugAvailability = await checkAvailability(check, user)
    if (slugAvailability.available) {
      return check
    }
    extraNumber++
  }
  // no success. could have a reserved prefix, substring, etc.
  return ''
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [user, userDbRow] = await getAuthUser(req, res)
  if (!user) {
    const wrapper: ErrorWrapper = {
      action: 'slugCheck',
      status: 401,
      success: false,
      errorId: 'ERR_UNAUTHORIZED',
      errorMsg: 'unauthorized',
    }
    res.status(401).json(wrapper)
    return
  }
  const slug = getParamString(req, 'slug')
  const check = await checkAvailability(slug, user)
  const source = userDbRow.user_slug ? 'user' : 'system'
  let suggested = undefined
  if (source === 'system') {
    suggested = await getSuggestedSlug(user)
  }
  const wrapper: SlugCheckWrapper = {
    action: 'slugCheck',
    status: 200,
    success: true,
    payload: {
      current: user.urlSlug,
      check: check,
      source,
      suggested,
    },
  }
  res.status(200).json(wrapper)
}
