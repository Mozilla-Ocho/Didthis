import { html } from '../utils/html'
import { ImageMetadata, Profile, Project } from '../lib/types'

export type Props = {
  profile?: Profile
  project: Project
  imageMetadata: Map<string, ImageMetadata>
}

export default function ({ profile, project, imageMetadata }: Props) {
  const avatarImage =
    profile?.imageAssetId && imageMetadata.get(profile.imageAssetId)
  const projectImage =
    project.imageAssetId && imageMetadata.get(project.imageAssetId)
  const projectUpdatesCount = project.updates?.length || 0

  return html`
    <section class="project">
      ${projectImage &&
      html`
        <span class="project-image">
          <img
            src="${projectImage.path}"
            alt="${project.title}"
            width="${projectImage.width}"
            height="${projectImage.height}"
          />
        </span>
      `}
      <section class="project-details">
        ${profile &&
        html`
          <span class="profile">
            ${avatarImage &&
            html`
              <span class="avatar-image">
                <img
                  src="${avatarImage.path}"
                  alt="${profile.name}"
                  width="${avatarImage.width}"
                  height="${avatarImage.height}"
                />
              </span>
            `}
            <span class="name">${profile.name}</span>
          </span>
        `}
        <span class="scope-status">
          <span class="scope">
            ${project.scope === 'public' ? 'Public' : 'Private'}
          </span>
          <span class="status">
            ${project.currentStatus === 'active' && 'In Progress'}
            ${project.currentStatus === 'paused' && 'Paused'}
            ${project.currentStatus === 'complete' && 'Complete'}
          </span>
        </span>
        <span class="updates-count">${projectUpdatesCount} updates</span>
        <span class="name"
          ><a href="./project-${project.id}.html">${project.title}</a></span
        >
        ${project.description &&
        html`<p class="description">${project.description}</p>`}
      </section>
    </section>
  `
}
