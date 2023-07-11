import branding from '@/lib/branding'
import Head from 'next/head'
import { cloudinaryUrlDirect, specialAssetIds } from '@/lib/cloudinaryConfig'
import profileUtils from '@/lib/profileUtils'
import pathBuilder from '@/lib/pathBuilder'

const OgMeta = ({ user, project }: { user: ApiUser; project?: ApiProject }) => {
  if (!user) return <></>

  if (!project) {
    // no specific project = a user project list
    const url = pathBuilder.user(user.publicPageSlug)
    const ugcUsername = user.profile.name || user.userSlug
    const title =
      (ugcUsername ? ugcUsername + '’s' : 'My') +
      ' projects | ' +
      branding.productName
    const desc = user.profile.bio
    let imgUrl: string | undefined
    if (user.profile.imageAssetId) {
      imgUrl = cloudinaryUrlDirect(
        user.profile.imageAssetId,
        'avatar',
        user.profile.imageMeta
      )
    }
    if (!imgUrl) {
      const projectAssetId = profileUtils.mostRecentPublicProjectImageAssetId(
        user.profile
      )
      if (projectAssetId)
        imgUrl = cloudinaryUrlDirect(projectAssetId, 'project')
    }
    if (!imgUrl) {
      imgUrl = cloudinaryUrlDirect(specialAssetIds.defaultAvatarID, 'avatar')
    }
    return (
      <Head>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        {desc && <meta name="twitter:description" content={desc} />}
        {imgUrl && <meta name="twitter:image" content={imgUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        {desc && <meta property="og:description" content={desc} />}
        <meta property="og:url" content={url} />
        {imgUrl && <meta property="og:image" content={imgUrl} />}
      </Head>
    )
  } else {
    // a specific project
    const url = pathBuilder.project(user.publicPageSlug, project.id)
    const ugcUsername = user.profile.name || user.userSlug
    const title =
      project.title +
      ' | project on ' +
      branding.productName +
      (ugcUsername ? ' | ' + ugcUsername : '')
    const desc = project.description
    let imgUrl: string | undefined
    if (project.imageAssetId) {
      imgUrl = cloudinaryUrlDirect(
        project.imageAssetId,
        'project',
        project.imageMeta
      )
    } else {
      imgUrl = cloudinaryUrlDirect(
        specialAssetIds.placholderProjectID,
        'project'
      )
    }
    return (
      <Head>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        {desc && <meta name="twitter:description" content={desc} />}
        {imgUrl && <meta name="twitter:image" content={imgUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        {desc && <meta property="og:description" content={desc} />}
        <meta property="og:url" content={url} />
        {imgUrl && <meta property="og:image" content={imgUrl} />}
      </Head>
    )
  }
}

export default OgMeta
