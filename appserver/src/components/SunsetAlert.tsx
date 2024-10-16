import { Link, Button, PagePad } from '@/components/uiLib'
import { useLocalStorage } from 'usehooks-ts'
import { useEffect, useState } from 'react'

const SunsetAlert = () => {
  const [suppressedAt, setSuppressedAt] = useLocalStorage(
    'suppressSunsetAlert', // DRY_26502
    0
  )

  // starts suppressed and async renders if needed.
  const [asyncSuppressedAt, setAsyncSuppressedAt] = useState((new Date()).getTime() - 1 * 60 * 60 * 1000)

  useEffect(() => {
    // SSR consistency. reflow after render if different from default,
    // because server doesn't know the local storage preference.
    if (asyncSuppressedAt !== suppressedAt) setAsyncSuppressedAt(suppressedAt)
  }, [suppressedAt, setAsyncSuppressedAt, asyncSuppressedAt])

  // if suppressed less than a day ago, don't show the alert
  if (asyncSuppressedAt && asyncSuppressedAt > ((new Date()).getTime() - 24 * 60 * 60 * 1000)) {
    return <></>
  }
  const hide24hr = () => {
    setSuppressedAt((new Date()).getTime())
    setAsyncSuppressedAt((new Date()).getTime())
  }

  return (
    <PagePad wide noPadY>
      <div className="py-4 px-6 mt-4 border-4 border-[#ff7777] rounded">
          <p className="text-lg">
             <strong>Important Update</strong>
             </p>
           <p>
             <span className="bold">Didthis will be shutting down on November 15th.</span> Please make sure to export your data before the sunset. <Link href="/sunset">Learn more here</Link>. 
          </p>
           <p className="mt-2">
           <Button intent="link" onClick={hide24hr}>Hide this alert for 1 day</Button>
           </p>
      </div>
    </PagePad>
  )
}

export default SunsetAlert
