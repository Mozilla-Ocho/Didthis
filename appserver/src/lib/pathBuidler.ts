const user = (slug: string): string => "/user/" + encodeURI(slug);
const project = (slug: string, projectId: string) =>
  user(slug) + "/project/" + encodeURI(projectId);
const home = () => "/";

const pathBuilder = {
  home,
  afterLogout: home,
  afterLogin: user,
  user,
  project,
  post: (slug: string, projectId: string, postId: string) =>
    project(slug, projectId) + "/post/" + encodeURI(postId),
  newPost: (slug: string) => user(slug) + "/newPost",
};

export default pathBuilder;
