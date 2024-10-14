import { html } from '../utils/html'
import layout, { Props as LayoutProps } from './_layout'
import { ImageMetadata, Profile, Project } from '../lib/types'
import templateProjectCard from './_projectCard'
import templateUpdateCard from './_updateCard'

export type Props = {
  profile: Profile
  project: Project
  imageMetadata: Map<string, ImageMetadata>
} & LayoutProps

export default function ({
  project,
  profile,
  imageMetadata,
  ...layoutProps
}: Props) {
  const updates = project.updates
    ?.filter(i => !!i)
    .sort((b, a) =>
      (a.didThisAt || a.createdAt) > (b.didThisAt || b.createdAt) ? -1 : 1
    )
  return layout(
    {
      title: `${project.title} - ${profile.name || "Unnamed User"} - Didthis Export`,
    },
    html`
      <section class="page-project">
        <section class="project-nav">
          <a href="./index.html">Home</a>
          <span>${project.title}</span>
        </section>
        <hr />
        <section class="project-columns">
          ${templateProjectCard({ project, profile, imageMetadata })}
          <section class="updates">
            ${updates &&
            updates.map(update =>
              templateUpdateCard({ update, imageMetadata })
            )}
          </section>
        </section>
      </section>
    `
  )
}
