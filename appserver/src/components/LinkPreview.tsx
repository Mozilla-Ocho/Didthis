import { observer } from 'mobx-react-lite'
import { Icon, Link } from '@/components/uiLib'

const StyledLinkPreview = ({
  loading,
  error,
  url,
  urlMeta,
}: {
  loading?: boolean
  error?: UrlMetaError
  url?: string
  urlMeta?: ApiUrlMeta
}) => {
  /* eslint-disable @next/next/no-img-element */
  return (
    <div className="grid grid-rows-[auto_auto] sm:grid-rows-1 sm:grid-cols-[auto_1fr] items-center border border-edges">
      <div className="text-center bg-black-100">
        {urlMeta?.imageUrl ? (
          <img
            src={urlMeta?.imageUrl}
            alt="thumbnail"
            width={urlMeta?.imageMeta?.width || null}
            height={urlMeta?.imageMeta?.height || null}
            className="inline-block max-h-[200px] max-w-[200px]"
          />
        ) : (
          <Icon.Link className="inline-block w-10 h-10 m-4 text-black-300" />
        )}
      </div>
      <div className="overflow-hidden p-3 bg-white">
        <p>
          {loading && 'Loading preview...'}
          {error === 'bad_url' && 'This link appears to be an invalid URL'}
          {error === 'remote_fetch' &&
            'Could not fetch the page for this link, is it a working page?'}
          {error === 'other' &&
            'Oops, there was an unexpected error fetching this link.'}
          {!loading && !error && urlMeta?.host && (
            <span className="text-linkpreview-host">{urlMeta?.host}</span>
          )}
        </p>
        <p className="truncate">
          {!loading && !error && url && (
            <strong>
              <Link external href={url}>
                {urlMeta?.title || url}
              </Link>
            </strong>
          )}
        </p>
      </div>
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
    urlMeta?: ApiUrlMeta | false
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
          urlMeta={urlMeta}
        />
      )
    } else {
      return <StyledLinkPreview url={linkUrl} />
    }
  }
)

export default LinkPreview
