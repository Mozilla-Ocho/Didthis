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

const MAX_CHARS = {
  names: 140,
  cloudinaryAssetIds: 100,
  urls: 300,
  urlMetaProps: 1000,
  userBlurbs: 1000,
};

const mkDefaultProfile = () => {
  return {
    projects: []
  } as ApiProfile;
};

const privacyFilteredCopy = (original: ApiProfile): ApiProfile => {
  const filtered = mkDefaultProfile();
  filtered.name = original.name;
  filtered.bio = original.bio;
  filtered.imageAssetId = original.imageAssetId;
  filtered.projects = [];
  (original.projects || []).forEach(origProj => {
    if (origProj.scope === "public") {
      const proj = JSON.parse(JSON.stringify(origProj)) as ApiProject
      proj.posts = proj.posts.filter(x => x.scope === "public")
      filtered.projects.push(proj)
    }
  })
  return filtered;
};

export { mkDefaultProfile, privacyFilteredCopy };
