import { Link, PagePad } from '@/components/uiLib'
import { trackingEvents } from '@/lib/trackingEvents'
import feedbackIcon from '@/assets/img/feedback.svg'
import Image from 'next/image'
import branding from '@/lib/branding'

const TrialAccountNag = ({ user }: { user: ApiUser }) => {
  return (
    <PagePad wide noPadY>
      <div className={`py-4 px-6 mt-4 bg-trialaccountnag`}>
        <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
          <Image
            className="inline w-8 h-8"
            src={feedbackIcon}
            alt="trial account warning icon"
          />
          <div className="text-sm">
            You're signed in with a temporary {branding.productName} trial
            account. You can{' '}
            <Link
              href={`/user/${user.systemSlug}/edit`}
              trackEvent={trackingEvents.bcTrialAccountNag}
            >
              <strong>claim this account</strong>
            </Link>{' '}
            by setting an email address and a password. This enables you to
            share content in public and to sign into this account later.
          </div>
        </div>
      </div>
    </PagePad>
  )
}

export default TrialAccountNag
