// the rules for validating user profile data from a user content point of
// view. this drives form validation in the client as well as backend
// validation of the same rules since clients are not trusted.

import normalizeUrl from 'normalize-url';
import { constants } from './constants';

function getParsedUrl({ url, strict }) {
  let parsedUrl;
  try {
    let processedUrl = url;
    if (!strict) {
      // this might throw an error but is more lenient than URL lib
      processedUrl = normalizeUrl(url, constants.normalizeUrlConfig);
    }
    // this can also throw an error and is strict
    parsedUrl = new URL(processedUrl);
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new Error('url scheme not allowed');
    }
    if (parsedUrl.username || parsedUrl.password) {
      throw new Error('auth on urls not allowed');
    }
  } catch (e) {
    // any error from normalizeUrl, new URL(), or our own rules
    return false;
  }
  return parsedUrl;
}

// XXX_PORTING add functions to validate project, project posts, etc, so the UI
// can use them granularly in form flows.

export function getValidationErrors({ data }) {
  let errors = {};

  if ((data.name || '').length > constants.MAX_CHARS.names) {
    errors.name = {
      errorMsg: `name is limited to at most ${constants.MAX_CHARS.names} characters`,
      // errorConst is used for e2e tests
      errorConst: 'ERR_NAME_TOO_LONG',
    };
  }

  if (
    (data.avatarPublicID || '').length > constants.MAX_CHARS.cloudinaryAssetIds
  ) {
    errors.avatarPublicID = {
      errorMsg: `avatar id is too long`,
      errorConst: 'ERR_AVATAR_ID_TOO_LONG',
    };
  }

  // XXX_PORTING removed prompt stuff, add project validation here

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors,
  };
}
