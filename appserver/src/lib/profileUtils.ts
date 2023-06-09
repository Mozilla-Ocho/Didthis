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
    projects: {}
  } as ApiProfile;
};

const mkBlankSlatePost = (projectId: "new" | string): ApiPost => {
  const seconds = Math.floor(new Date().getTime() / 1000)
  return {
    id: "new", // assigned on save
    createdAt: seconds, // asigned on save
    updatedAt: seconds, // asigned on save
    projectId: projectId, // assigned on save if "new"
    scope: "public",
    description: "",
  }
}

const privacyFilteredCopy = (original: ApiProfile): ApiProfile => {
  const filtered = mkDefaultProfile();
  filtered.name = original.name;
  filtered.bio = original.bio;
  filtered.imageAssetId = original.imageAssetId;
  filtered.projects = {}
  Object.values(original.projects || {}).forEach((origProj) => {
    if (origProj.scope === "public") {
      const proj = JSON.parse(JSON.stringify(origProj)) as ApiProject;
      Object.keys(proj.posts).forEach(pid => {
        if (proj.posts[pid].scope !== "public") {
          delete proj.posts[pid]
        }
      })
      filtered.projects[proj.id] = proj
    }
  });
  return filtered;
};

const getParsedUrl = ({
  url,
  strict,
}: {
  url: string;
  strict: boolean;
}): URL | false => {
  let parsedUrl;
  try {
    let processedUrl = url;
    if (!strict) {
      // this might throw an error but is more lenient than URL lib
      processedUrl = normalizeUrl(url, normalizeUrlConfig);
    }
    // this can also throw an error and is strict
    parsedUrl = new URL(processedUrl);
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      throw new Error("url scheme not allowed");
    }
    if (parsedUrl.username || parsedUrl.password) {
      throw new Error("auth on urls not allowed");
    }
  } catch (e) {
    // any error from normalizeUrl, new URL(), or our own rules
    return false;
  }
  return parsedUrl;
};

const cleanupUserInput = (profile: ApiProfile): void => {
  // mutates the profile data in place to trim whitespace so we aren't confused
  // about empty fields.
  function trimRecurse(obj: JSONABLE): JSONABLE {
    if (typeof obj === "undefined" || obj === null) return obj;
    if (typeof obj === "string") return obj.trim();
    if (Array.isArray(obj)) return obj.map(trimRecurse);
    if (typeof obj === "object") {
      const newObj: JSONABLE = {};
      for (const prop in obj) {
        newObj[prop] = trimRecurse(obj[prop]);
      }
      return newObj;
    }
    return obj;
  }
  trimRecurse(profile);
};

const generateRandomAvailablePostId = (profile: ApiProfile): string => {
  const mkRandId = () => {
    const chars = "bcdfghjkmnpqrstvwxyz23456789";
    let slug = "";
    for (let i = 0; i < 5; i++) {
      slug = slug + chars[Math.floor(Math.random() * chars.length)];
    }
    return slug;
  };
  let available = false;
  let id = mkRandId();
  while (!available) {
    const existing = Object.values(profile.projects).find((proj) => Object.values(proj.posts).find(post => post.id === id));
    if (existing) {
      id = mkRandId();
    } else {
      available = true;
    }
  }
  return id;
};

const generateRandomAvailableProfileId = (profile: ApiProfile): string => {
  const mkRandId = () => {
    const chars = "bcdfghjkmnpqrstvwxyz23456789";
    let slug = "";
    for (let i = 0; i < 5; i++) {
      slug = slug + chars[Math.floor(Math.random() * chars.length)];
    }
    return slug;
  };
  let available = false;
  let id = mkRandId();
  while (!available) {
    const existing = Object.values(profile.projects).find((p) => p.id === id);
    if (existing) {
      id = mkRandId();
    } else {
      available = true;
    }
  }
  return id;
};

const mkNewProject = (
  profile: ApiProfile
): { profile: ApiProfile; projectId: string, project: ApiProject } => {
  const projectId = generateRandomAvailableProfileId(profile);
  let i = 1;
  Object.values(profile.projects).forEach(proj => {
    if (proj.title.trim().match(/^Untitled Project( \d+)?$/)) {
      const num = proj.title.split(/ +/)[2] || "1"
      if (num)
        i = Math.max(parseInt(num,10)+1,i)
    }
  })
  const counter = (i > 1) ? " "+i : "";
  const seconds = Math.floor(new Date().getTime() / 1000)
  const project: ApiProject = {
    id: projectId,
    title: "Untitled Project"+counter,
    createdAt: seconds,
    updatedAt: seconds,
    currentStatus: "active",
    scope: "private",
    posts: {},
  };
  profile.projects[project.id] = project;
  return { profile, projectId, project };
};

const profileUtils = {
  mkDefaultProfile,
  privacyFilteredCopy,
  getParsedUrl,
  cleanupUserInput,
  maxChars,
  mkNewProject,
  generateRandomAvailablePostId,
  mkBlankSlatePost,
};

export default profileUtils;
