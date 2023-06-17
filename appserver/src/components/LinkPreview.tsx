import { observer } from 'mobx-react-lite'
import { Icon, Link } from '@/components/uiLib'

const ellipsis = (s: string, len: number): string =>
  s.length > len ? s.substring(0, len) + '...' : s

const mkLink = (url: string, text?: string) => (
  <Link external href={url}>
    {text ? text : ellipsis(url, 100)}
  </Link>
)

const StyledLinkPreview = ({
  loading,
  error,
  url,
  title,
  host,
  imageUrl,
}: {
  loading?: boolean
  error?: UrlMetaError
  url?: string
  title?: string
  host?: string
  imageUrl?: string
}) => {
  /* eslint-disable @next/next/no-img-element */
  return (
    <div>
      <div className="thethumb">
        {imageUrl ? <img src={imageUrl} alt="thumbnail" className="w-auto h-auto max-h-[200px] max-w-[200px]" /> : <Icon.Link />}
      </div>
      <p className="thehost">
        {loading && 'Loading preview...'}
        {error === "bad_url" && 'This link appears to be an invalid URL'}
        {error === "remote_fetch" && 'Could not fetch the page for this link, is it a working page?'}
        {error === "other" && 'Oops, there was an unexpected error fetching this link.'}
        {!loading && !error && host && <span>{host}</span>}
      </p>
      <p className="thelink">
        {!loading && !error && url && <strong>{mkLink(url, title)}</strong>}
      </p>
    </div>
  )
}

const LinkPreview = observer(
  ({
    linkUrl,
    urlMeta,
    loading,
    error,
  }: {
    linkUrl: string
    urlMeta?: ApiUrlMeta | false,
    loading?: boolean
    error?: UrlMetaError
  }) => {
    if (!linkUrl || linkUrl.trim().length === 0) return <></>

    if (loading) {
      return <StyledLinkPreview loading />
    }

    if (error) {
      return <StyledLinkPreview error={error} />
    }

    if (urlMeta) {
      return (
        <StyledLinkPreview
          url={linkUrl}
          title={urlMeta.title}
          host={urlMeta.host}
          imageUrl={urlMeta.imageUrl}
        />
      )
    } else {
      return <StyledLinkPreview url={linkUrl} />
    }
  }
)

export default LinkPreview
