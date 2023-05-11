// for fast prototyping, user profile data is stored as a json blob in the
// backend and this object provides an interface to it, and (de)serialization.
// it also validates the structure and content, so both frontend and backend
// use this code.

import { constants } from './constants';
import { parse } from './parse';
import { getValidationErrors } from './validation';

class UserProfile {
  _data:any = {};

  constructor(opts?:any) {
    opts = opts || {};
    let parsed;
    if (opts.json) {
      parsed = parse({ json: opts.json });
    } else if (opts.data) {
      parsed = parse({ data: opts.data });
    }
    for (let key of constants.PROFILE_KEYS) {
      if (parsed && parsed.hasOwnProperty(key)) {
        this._data[key] = parsed[key];
      }
    }
    this.backfillDefaults();
  }

  /* {{{
   * explicit getters and setters allow us to:
   * - work with only constrained / allowed keys
   * - validate them if we want
   * - apply logic upon assignment
   * - be mobx observable friendly
   */
  get name() {
    return this._data.name;
  }

  set name(x) {
    this._data.name = x;
  }

  get bio() {
    return this._data.bio;
  }

  set bio(x) {
    this._data.bio = x;
  }

  get avatarPublicID() {
    return this._data.avatarPublicID;
  }

  set avatarPublicID(x) {
    this._data.avatarPublicID = x;
  }

  get version() {
    return this._data.version;
  }

  set version(x) {
    this._data.version = x;
  }

  // }}} getters/setters

  backfillDefaults() {
    const defaults = constants.mkDefaultProfile();
    for (let key of constants.PROFILE_KEYS) {
      // @ts-ignore
      this[key] = this[key] || defaults[key];
    }
  }

  cleanupUserInput() {
    // the backend applies this transformation before saving.  this makes it
    // easy to test for the presence of data in a field so we aren't thrown off
    // by pure whitespace.
    function trimRecurse(obj:any):any {
      if (typeof obj === 'undefined' || obj === null) return obj;
      if (typeof obj === 'string') return obj.trim();
      if (Array.isArray(obj)) return obj.map(trimRecurse);
      if (typeof obj === 'object') {
        const newObj:any = {};
        for (let prop in obj) {
          newObj[prop] = trimRecurse(obj[prop]);
        }
        return newObj;
      }
      return obj;
    }
    this._data = trimRecurse(this._data);
  }

  get validation() {
    return getValidationErrors({ data: this._data });
  }

  isMinimallyComplete({ urlSlug }:any) {
    // returns true if sufficient data is defined for the homepage to be live.
    // since the slug is not part of the profile object, urlSlug must be
    // passed in.
    return !!(
      this.name &&
      this.name.trim() &&
      this.avatarPublicID &&
      urlSlug &&
      urlSlug.trim()
    );
  }

  toJSON() {
    return JSON.stringify(this._data);
  }

  toPOJO() {
    // this is used for returning profile data in payloads on the json api.
    // could return this._data here but that letters callers access/mutate
    // internal state.
    return JSON.parse(this.toJSON());
  }
}

export { UserProfile };
