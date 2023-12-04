import { observer } from 'mobx-react-lite'
import { Divider, PagePad } from '@/components/uiLib'
import ProjectList from '../ProjectList'
import UserPreview from '../UserPreview'
import NotFound from './NotFound'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import PageTitle from '../PageTitle'
import OgMeta from '../OgMeta'
import RemindersAndAlerts from '../RemindersAndAlerts'
import ViralWaitlistBlurb from '../ViralWaitlistBlurb'

// TODO: rename this to NonAuthUser or something, it's shown even in auth but
// when looking at someone else's page
const UnauthUser = observer(
  ({ targetUser }: { targetUser: ApiUser | false }) => {
    const store = useStore()
    if (!targetUser) return <NotFound />
    store.useTrackedPageEvent(trackingEvents.pvUser, {
      slug: targetUser.publicPageSlug,
    })
    return (
      <>
        <ViralWaitlistBlurb fromPage='user' targetUserSlug={targetUser.publicPageSlug} />
        <RemindersAndAlerts />
        <PagePad>
          <OgMeta user={targetUser} />
          <PageTitle title={targetUser.userSlug || targetUser.profile.name} />
          <UserPreview user={targetUser} compact={false} />
          <Divider light />
          <h3>Projects</h3>
          <ProjectList targetUser={targetUser} />
        </PagePad>
      </>
    )
  }
)

export default UnauthUser
