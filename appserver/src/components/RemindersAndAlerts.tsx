import { useStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import DiscordNag from './DiscordNag'
import TrialAccountNag from './TrialAccountNag'
import TrialAccountSignedUpAlert from './TrialAccountSignedUpAlert'

const CLEAR_SIGNED_UP_ALERT_DELAY = 5000;

export const RemindersAndAlerts = () => {
  const store = useStore()
  const [showTrialAccountSignedUpAlert, setShowTrialAccountSignedUpAlert] =
    useState(false)

  useEffect(() => {
    const val = store.wasTrialAccountClaimed()
    setShowTrialAccountSignedUpAlert(val)
    setTimeout(() => {
      store.clearTrialAccountClaimed()
    }, CLEAR_SIGNED_UP_ALERT_DELAY)
  }, [store])

  return (
    <>
      {store.user && store.user.isTrial && (
        <TrialAccountNag user={store.user} />
      )}
      {showTrialAccountSignedUpAlert ? (
        <TrialAccountSignedUpAlert />
      ) : (
        <DiscordNag />
      )}
    </>
  )
}

export default RemindersAndAlerts
