import { observer } from 'mobx-react-lite'
import { Icon, Link } from '@/components/uiLib'
import Spinner from './uiLib/Spinner'

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
  // TODO: these don't look great when being flash-highlighted on project page
  return (
    <div className="grid grid-rows-[auto_auto] overflow-hidden border rounded-lg border-black-100">
      <div className="text-center bg-yellow-100">
        {urlMeta?.imageUrl ? (
          <img
            src={urlMeta?.imageUrl}
            alt="thumbnail"
            width={urlMeta?.imageMeta?.width || null}
            height={urlMeta?.imageMeta?.height || null}
            className="inline-block object-contain max-h-[150px] max-w-[200px]"
          />
        ) : (
          <Icon.Link className="inline-block w-10 h-10 m-4 text-black-300" />
        )}
      </div>
      <div className="overflow-hidden p-4 bg-white">
        <p>
          {loading && <span><Spinner className="inline-block mr-2 align-text-bottom" /> Loading preview...</span>}
          {error && <span className="text-black-300"><em>
          {error === 'bad_url' && 'This link appears to be an invalid URL'}
          {error === 'remote_fetch' &&
            'Could not fetch the page for this link, is it a working page?'}
          {error === 'other' &&
            'Oops, there was an unexpected error fetching this link.'}
          </em></span>}
          {!loading && !error && urlMeta?.host && (
            <span className="text-linkpreview-host">{urlMeta?.host} &mdash; </span>
          )}
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
