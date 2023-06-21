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
  legal: (doc: "tos" | "pp" | "au") => {
    if (doc === "tos") return '/terms'
    if (doc === "pp") return '/privacy'
    if (doc === "au") return '/acceptable-use'
    return '/terms'
  }
}

export default pathBuilder
