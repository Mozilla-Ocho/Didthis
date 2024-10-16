import { html } from '../utils/html'
import layout, { Props as LayoutProps } from './_layout'
import { ImageMetadata, Profile } from '../lib/types'
import templateProfileCard from './_profileCard'
import templateProjectCard from './_projectCard'

export type Props = {
  profile: Profile
  imageMetadata: Map<string, ImageMetadata>
} & LayoutProps

export default function ({ profile, imageMetadata, ...layoutProps }: Props) {
  return layout(
    {
      title: `${profile.name || 'Unnamed User'} - Didthis Export`,
    },
    html`
      <section class="page-index">
        ${templateProfileCard({ profile, imageMetadata })}
        <hr />
        <h2>Projects</h2>
        <section class="projects">
          ${profile.projects
            ?.filter(i => !!i)
            .map(project => templateProjectCard({ project, imageMetadata }))}
        </section>
      </section>
    `
  )
}
