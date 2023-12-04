import knex from "@/knex"
import profileUtils from "./profileUtils"
import {isReserved} from "./reservedSlugs"

const checkAvailability = async (
  checkSlug: string,
  user: ApiUser
): Promise<SlugCheck> => {
  checkSlug = checkSlug.trim()
  const checkLower = checkSlug.toLowerCase()
  if (checkLower === user.userSlug?.toLowerCase() || checkSlug === user.systemSlug) {
    // it's their own slug. is it "available"? let's say yes because it's
    // easier for logic: we don't render an error and we allow the user
    // to click save, etc. this also means they could change the case on their
    // slug w/o issue.
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
        .where('user_slug_lc', checkLower)
        .orWhere('system_slug', checkSlug)
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

const getSuggestedSlug = async (user: ApiUser, provisionalName: string): Promise<string> => {
  provisionalName = (provisionalName || '').trim()
  const profileName = (user.profile.name || '').trim()
  const useName = provisionalName || profileName
  let slug = useName
  if (!slug) {
    // no name? empty suggestion
    return ''
  }
  // convert "foo bar baz" to "FooBarBaz" and then replace "F" with "f" (the
  // users first letter case is preserved)
  slug = slug.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
  })
  slug = useName.charAt(0) + slug.substring(1)
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

export {
  checkAvailability,
  getSuggestedSlug
}
