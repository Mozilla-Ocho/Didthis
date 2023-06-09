const user = (slug: string): string => '/user/' + encodeURI(slug)
const project = (slug: string, projectId: string) =>
  user(slug) + '/project/' + encodeURI(projectId)
const home = () => '/'

const pathBuilder = {
  home,
  afterLogout: home,
  afterLogin: user,
  user,
  project,
  post: (slug: string, projectId: string, postId: string) =>
    project(slug, projectId) + '/post/' + encodeURI(postId),
  newPost: (slug: string, projectId?: string) => {
    if (projectId)
      return user(slug) + '/post?projectId=' + encodeURIComponent(projectId)
    else return user(slug) + '/post'
  },
}

export default pathBuilder
