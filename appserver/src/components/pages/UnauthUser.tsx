import { observer } from 'mobx-react-lite'
import { Divider, H } from '@/components/uiLib'
import ProjectList from '../ProjectList'
import UserPreview from '../UserPreview'
import NotFound from './NotFound'

const UnauthUser = observer(({ targetUser }: { targetUser: ApiUser | false }) => {
  if (!targetUser) return <NotFound />
  return (
    <>
      <UserPreview user={targetUser} compact={false} />
      <Divider light />
      <H.H3>Projects</H.H3>
      <ProjectList targetUser={targetUser} />
    </>
  )
})

export default UnauthUser
