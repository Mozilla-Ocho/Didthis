import normalizeUrl from "normalize-url";

// a bunch of helpers for ApiProfile POJOs
const normalizeUrlConfig = {
  // we're not using normalizeUrl to strip down urls to their essentials, we
  // are using it as a user input parser that is more lenient than URL() lib.
  // for example you can give it 'twitter.com/foo' and it will return
  // 'https://twitter.com/foo' where URL() would throw an error.
  defaultProtocol: "https" as const,
  removeTrailingSlash: false,
  removeSingleSlash: false,
  stripTextFragment: false,
  stripAuthentication: false,
  stripHash: false,
  stripProtocol: false,
  stripWWW: false,
  removeDirectoryIndex: false,
  sortQueryParameters: false,
};

const maxChars = {
  name: 140,
  imageAssetId: 100,
  url: 300,
  blurbs: 1000,
};

const mkDefaultProfile = () => {
  return {
    projects: [],
  } as ApiProfile;
};

const privacyFilteredCopy = (original: ApiProfile): ApiProfile => {
  const filtered = mkDefaultProfile();
  filtered.name = original.name;
  filtered.bio = original.bio;
  filtered.imageAssetId = original.imageAssetId;
  filtered.projects = [];
  (original.projects || []).forEach((origProj) => {
    if (origProj.scope === "public") {
      const proj = JSON.parse(JSON.stringify(origProj)) as ApiProject;
      proj.posts = proj.posts.filter((x) => x.scope === "public");
      filtered.projects.push(proj);
    }
  });
  return filtered;
};

const getParsedUrl = ({ url, strict }:{url: string, strict: boolean}) : (URL | false) => {
  let parsedUrl;
  try {
    let processedUrl = url;
    if (!strict) {
      // this might throw an error but is more lenient than URL lib
      processedUrl = normalizeUrl(url, normalizeUrlConfig);
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

const cleanupUserInput = (profile: ApiProfile) : void => {
  // trims whitespace so we aren't confused about empty fields.
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
  trimRecurse(profile)
}

const profileUtils = { mkDefaultProfile, privacyFilteredCopy, getParsedUrl, cleanupUserInput, maxChars };

export default profileUtils;
