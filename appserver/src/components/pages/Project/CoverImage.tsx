import { specialAssetIds } from '@/lib/cloudinaryConfig'
import { CloudinaryImage } from '@/components/uiLib'

// the cover image moves position in the native app and gets a gradient at
// the bottom, and also the UserPreview gets a negative margin to come up
// and overlap that gradient.
const CoverImage = ({
  inAppWebView,
  project,
}: {
  inAppWebView: boolean
  project: ApiProject
}) => (
  <div className="relative">
    {inAppWebView && (
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: '60px',
          background:
            'linear-gradient(rgba(255, 255, 255, 0) 0%,rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.9) 85%, rgba(255, 255, 255, 1) 100%)',
        }}
      ></div>
    )}
    {!!project.imageAssetId ? (
      <CloudinaryImage
        assetId={project.imageAssetId}
        intent="project"
        lightbox
        fullW
      />
    ) : (
      <CloudinaryImage
        assetId={specialAssetIds.placholderProjectID}
        rounded
        intent="project"
        fullW
      />
    )}
  </div>
)

export default CoverImage
