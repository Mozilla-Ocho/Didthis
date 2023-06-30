import { observer } from 'mobx-react-lite'
import { Divider, PagePad } from '@/components/uiLib'
import ProjectList from '../ProjectList'
import UserPreview from '../UserPreview'
import NotFound from './NotFound'

// TODO: rename this to NonAuthUser or something, it's shown even in auth but
// when looking at someone else's page
const UnauthUser = observer(
  ({ targetUser }: { targetUser: ApiUser | false }) => {
    if (!targetUser) return <NotFound />
    return (
      <>
        <PagePad>
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
