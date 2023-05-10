import { constants } from './constants';

function isPOJO(obj) {
  // ensures the object, at the top level is a plain object (not an instance of
  // a special class), and that all its properties are either plain objects or
  // plain data types (number, boolean, string, array, null, pojo) recursively.
  //
  if (typeof obj !== 'object') return false;
  // checking the prototype is from https://masteringjs.io/tutorials/fundamentals/pojo
  const proto = Object.getPrototypeOf(obj);
  if (proto !== null && proto.constructor.name !== 'Object') return false;
  // now we do a deep check to ensure everything else is either a pojo, array,
  // string, bool, or number.
  function _isPlainData(x) {
    if (typeof x === 'string') return true;
    if (typeof x === 'boolean') return true;
    if (typeof x === 'number') return true;
    if (x === null) return true;
    if (Array.isArray(x)) {
      for (let v of x) {
        if (!_isPlainData(v)) return false;
      }
      return true;
    }
    if (isPOJO(x)) return true;
    return false;
  }
  for (let prop in obj) {
    if (!_isPlainData(obj[prop])) return false;
  }
  return true;
}

const validateUrlMeta = (urlMeta, errContext) => {
  if (typeof urlMeta === 'undefined') return;
  if (!isPOJO(urlMeta))
    throw new Error(errContext + ' url meta must be undef or a pojo');
  if (typeof urlMeta.host !== 'string')
    throw new Error(errContext + ' url meta host must be a string');
  if (typeof urlMeta.title !== 'string')
    throw new Error(errContext + ' url meta title must be a string');
  if (typeof urlMeta.imageUrl !== 'string')
    throw new Error(errContext + ' url meta imageUrl must be a string');
  for (let urlMetaProp in urlMeta) {
    const allowed = ['host', 'title', 'imageUrl'];
    if (allowed.indexOf(urlMetaProp) < 0) {
      throw new Error(
        errContext +
          ' unexpected property in url meta: ' +
          JSON.stringify(urlMetaProp)
      );
    }
  }
};

export function parse({ json, data }) {
  // either json or a data POJO must be given, but not both. this also
  // validates the data schema (required keys are present, unexpected keys
  // aren't present, values are of the right type, etc), but it does not
  // validate content in the sense of *form* validation, such as max content
  // length, making sure url strings are not javascript urls, etc. that is part
  // of getValidationErrors() - see validation.mjs

  if (json && data) {
    throw new Error('specify json or a data POJO as input but not both');
  }

  if (json) {
    // parse
    try {
      data = JSON.parse(json);
    } catch (e) {
      throw new Error('unparsable JSON');
    }
  }

  if (typeof data !== 'object') {
    throw new Error('profile data must be a plain object');
  }
  if (Array.isArray(data)) {
    throw new Error('profile data must be a plain object');
  }
  if (!isPOJO(data)) {
    throw new Error('profile data must be a plain object');
  }

  if (!json) {
    // if not given json, but rather a direct data object, we have to fully
    // clone it, because the parsing process can mutate it (with v1->v2
    // prompts) and parsing needs to be a pure function or it will be
    // surprising and buggy.
    data = JSON.parse(JSON.stringify(data));
  }

  // validate no unknown attributes
  const keys = Object.keys(data);
  for (let key of keys) {
    if (constants.PROFILE_KEYS.indexOf(key) < 0) {
      throw new Error(`unexpected property ${JSON.stringify(key)}`);
    }
  }

  // version
  if (typeof data.version === 'undefined') {
    // ok
  } else if (
    Number.isInteger(data.version) &&
    data.version > 0 &&
    data.version <= constants.CURRENT_VERSION
  ) {
    // ok
  } else {
    throw new Error(
      `version must be undefined or a positive integer <= ${constants.CURRENT_VERSION}`
    );
  }

  // name
  if (typeof data.name === 'undefined') {
    // ok
  } else if (typeof data.name !== 'string') {
    throw new Error(`name must be undefined or a string`);
  }

  // bio
  if (typeof data.bio === 'undefined') {
    // ok
  } else if (typeof data.bio !== 'string') {
    throw new Error(`bio must be undefined or a string`);
  }

  // avatarPublicID
  if (typeof data.avatarPublicID === 'undefined') {
    // ok
  } else if (typeof data.avatarPublicID !== 'string') {
    throw new Error(`avatarPublicID must be undefined or a string`);
  }

  // XXX_PORTING removed prompt stuff, add project validation here

  return data;
}
