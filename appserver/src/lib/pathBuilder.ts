const user = (slug: string): string => '/user/' + encodeURI(slug)
const project = (slug: string, projectId: string) =>
  user(slug) + '/project/' + encodeURI(projectId)
const home = () => '/'

const pathBuilder = {
  home,
  afterLogout: home,
  afterLogin: user,
  user,
  userEdit: (slug: string) => user(slug) + '/edit',
  project,
  projectEdit: (slug: string, projectId: string) =>
    project(slug, projectId) + '/edit',
  newProject: (slug: string) => user(slug) + '/project/new',
  post: (slug: string, projectId: string, postId: string) =>
    project(slug, projectId) + '/post/' + encodeURI(postId),
  postEdit: (slug: string, projectId: string, postId: string) =>
    project(slug, projectId) + '/post/' + encodeURI(postId) + '/edit',
  newPost: (slug: string, projectId?: string) => {
    if (projectId)
      return user(slug) + '/post?projectId=' + encodeURIComponent(projectId)
    else return user(slug) + '/post'
  },
  legal: (doc: "tos" | "pp" | "cp") => {
    // DRY_86188 legal page routes
    if (doc === "tos") return '/terms'
    if (doc === "pp") return '/privacy'
    if (doc === "cp") return '/content'
    return '/terms'
  },
  makeFullUrl: (path: string) => {
    return process.env.NEXT_PUBLIC_API_ENDPOINT+path
  }
}

export default pathBuilder

