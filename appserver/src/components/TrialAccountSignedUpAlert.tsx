import { useEffect, useState } from 'react'
import { Link, PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import feedbackIcon from '@/assets/img/feedback.svg'
import Image from 'next/image'
import branding from '@/lib/branding'

const TrialAccountSignedUpAlert = () => {
  return (
    <PagePad wide noPadY>
      <div id="trialaccountsignedup" className={`py-4 px-6 mt-4 bg-trialaccountsignedup`}>
        <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
          <Image
            className="inline w-8 h-8"
            src={feedbackIcon}
            alt="feedback icon"
          />
          <div className="text-sm">
            Hi there, {branding.productName} alpha tester, you're all signed up!
            Welcome to your new account!
          </div>
        </div>
      </div>
    </PagePad>
  )
}

export default TrialAccountSignedUpAlert
