import { useStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import DiscordNag from './DiscordNag'
import TrialAccountNag from './TrialAccountNag'
import TrialAccountSignedUpAlert from './TrialAccountSignedUpAlert'

export const RemindersAndAlerts = () => {
  const store = useStore()
  const [showTrialAccountSignedUpAlert, setShowTrialAccountSignedUpAlert] =
    useState(false)

  useEffect(() => {
    const val = store.wasTrialAccountClaimed()
    console.log("WAS CLAIMED", val)
    setShowTrialAccountSignedUpAlert(val)
    store.clearTrialAccountClaimed()
  }, [])

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
