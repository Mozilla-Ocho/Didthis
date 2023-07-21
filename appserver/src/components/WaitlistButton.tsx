import { Button, Input, Modal } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { useState } from 'react'
import branding from '@/lib/branding'

function minDelay<T>(delayMS: number, inputPromise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let hasResolved = false
    let result: T
    inputPromise
      .then(data => {
        result = data
        hasResolved = true
      })
      .catch(reject)
    setTimeout(() => {
      if (hasResolved) {
        resolve(result)
      } else {
        inputPromise.then(resolve, reject)
      }
    }, delayMS)
  })
}

const WaitlistButton = observer(({}) => {
  const store = useStore()
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [formError, setFormError] = useState<false | 'email' | 'other'>(false)
  const [spinning, setSpinning] = useState(false)
  const [success, setSuccess] = useState(false)
  const handleClick = () => {
    store.trackEvent(trackingEvents.bcWaitlist)
    setIsOpen(true)
  }
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => {
    setIsOpen(false)
    setEmail('')
    setValidEmail(false)
    setSpinning(false)
    setFormError(false)
    setSuccess(false)
  }
  const postWaitlist = async (): Promise<'success' | 'bademail' | 'other'> => {
    const url =
      // trailing slash is critical here
      process.env.NEXT_PUBLIC_ENV_NAME === 'prod'
        ? 'https://basket.mozilla.org/news/subscribe/'
        : 'https://basket-dev.allizom.org/news/subscribe/'
    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(
        Object.entries({
          email,
          newsletters: 'didthis-waitlist',
          source_url: window.location.href,
          trigger_welcome: 'N',
          // anything didthis_ is custom and will be tracked w/ the entry.
          // didthis_geo: 'us',
          // didthis_platform: 'es',
        })
      ).toString(),
    }
    const res = await fetch(url, config)
    const txt = await res.text()
    console.log('waitlist result:', res)
    console.log('waitlist result txt:', txt)
    if (txt.match(/BASKET_INVALID_EMAIL/)) {
      return 'bademail'
    }
    if (res.status === 200) {
      store.trackEvent(trackingEvents.caJoinWaitlist)
      return 'success'
    } else {
      return 'other'
    }
  }
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (validEmail) {
      setSpinning(true)
      minDelay(1000, postWaitlist())
        .then(x => {
          setSpinning(false)
          if (x === 'success') {
            setSuccess(true)
            setFormError(false)
          } else if (x === 'bademail') {
            setFormError('email')
          } else {
            setFormError('other')
          }
        })
        .catch(() => {
          setSpinning(false)
          setFormError('other')
        })
    }
  }
  const handleEmailChg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setValidEmail(!!e.target.value.match(/\w+@\w+\.\w+/))
  }
  return (
    <>
      <Modal
        srTitle={success ? 'Thank you!' : 'Join the waitlist'}
        renderTitleHeading
        isOpen={isOpen}
        handleClose={onClose}
        closeX
      >
        <div className="max-w-sm">
          {success && (
            <p>
              We’ll send you an email when registration opens up. Stay tuned.
            </p>
          )}
          {!success && (
            <>
              <p>
                {branding.productName} test accounts are limited right now —
                join our waitlist and we’ll notify you when you’re in!
              </p>
              <form
                method="POST"
                onSubmit={handleSubmit}
                className="grid grid-cols-[1fr_auto] gap-2 my-4"
              >
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChg}
                  justTheInputOnly
                />
                <Button
                  spinning={spinning}
                  type="submit"
                  disabled={!validEmail}
                >
                  Submit
                </Button>
              </form>
              {formError === 'email' && (
                <p className="text-red-500 my-2">
                  Invalid email address
                </p>
              )}
              {formError === 'other' && (
                <p className="text-red-500 my-2">
                  There was an error processing the form &mdash; please reload
                  the page and try again
                </p>
              )}
              <p>
                (We won’t share your email with anyone, and will only contact
                you to send your {branding.productName} invitation or to ask for
                your feedback.)
              </p>
            </>
          )}
        </div>
      </Modal>
      <Button onClick={handleClick} data-testid="waitlistbutton">
        Join the wait list
      </Button>
    </>
  )
})

export { WaitlistButton }
