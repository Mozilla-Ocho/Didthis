import { html } from '../utils/html'
import { ImageMetadata, Profile } from '../lib/types'

export type Props = {
  profile: Profile
  imageMetadata: Map<string, ImageMetadata>
}

export default function ({ profile, imageMetadata }: Props) {
  const avatarImage =
    profile.imageAssetId && imageMetadata.get(profile.imageAssetId)

  return html`
    <section class="profile">
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
      ${profile.bio && html`<p class="bio">${profile.bio}</p>`}
    </section>
  `
}
