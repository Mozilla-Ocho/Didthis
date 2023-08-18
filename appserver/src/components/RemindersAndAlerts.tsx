import { useStore } from '@/lib/store'
import DiscordNag from './DiscordNag'
import TrialAccountNag from './TrialAccountNag'

export const RemindersAndAlerts = () => {
  const store = useStore()
  return (
    <>
      <DiscordNag />
      {store.user && store.user.isTrial && <TrialAccountNag user={store.user} />}
    </>
  )
}

export default RemindersAndAlerts
