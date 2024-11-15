import { DeferredSignupButton } from '@/components/auth/DeferredSignupButton'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import branding from '@/lib/branding'
import captureProgres2x from '@/assets/img/capture_your_progress2x.png'
import worksWithAnyHobby2x from '@/assets/img/works_with_any_hobby_2x.png'
import shareAndCelebrate2x from '@/assets/img/share_and_celebrate2x.png'
import hiking2x from '@/assets/img/hiking_2x.png'
import knitting2x from '@/assets/img/knitting_2x.png'
import woodworking2x from '@/assets/img/woodworking_2x.png'
import baking2x from '@/assets/img/baking_2x.png'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { useEffect } from 'react'
import { WaitlistButton } from '../WaitlistButton'
import { Button, Link, PagePad } from '../uiLib'
import { useAppShellListener } from '@/lib/appShellContent'
import { LoginButton } from '../auth/LoginButton'
import SunsetAlert from '../SunsetAlert'

// DRY_20334 outer page width styles
const HomeUnauth = () => {
  const store = useStore()
  useAppShellListener('appleCredential', payload => {
    store.loginWithAppleId(payload.credential, payload.justCreated)
  })

  const topicBucket = 'utility' // as of 09/05/23 all users see utility messaging
  store.useTrackedPageEvent(trackingEvents.pvHomeUnauth, { topicBucket })
  useEffect(() => {
    // special tracking event for campaign conversion, if user viewed unauth
    // landing page unauth with a valid sign up code, mark that, and we'll
    // put it in a funnel with a signup (or authSession) event.
    if (store.signupCodeInfo && store.signupCodeInfo.active) {
      store.trackEvent(trackingEvents.validCodeHomeUnauth, {
        signupCodeName: store.signupCodeInfo.name,
        topicBucket,
      })
    } else {
      // otherwise, track special event for homepage waitlist funnel
      // 20231212 note this event is not quite named correctly now, since we're
      // inviting users to install via testflight now. this event represents
      // views of the homepage that don't have an invite code.
      store.trackEvent(trackingEvents.waitlistHomeUnauth, { topicBucket })
    }
  })

  const invited = store.signupCodeInfo && store.signupCodeInfo.active

  let hobbyImg2x = woodworking2x
  let hobbyAlt =
    'An iPhone screenshot showing the DidThis application featuring a woodworking project in progress'
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-knitting') {
    hobbyImg2x = knitting2x
    hobbyAlt =
      'An iPhone screenshot showing the DidThis application featuring a knitting project in progress'
  }
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-textile') {
    hobbyImg2x = knitting2x
    hobbyAlt =
      'An iPhone screenshot showing the DidThis application featuring a knitting project in progress'
  }
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-cooking') {
    hobbyImg2x = baking2x
    hobbyAlt =
      'An iPhone screenshot showing the DidThis application featuring a bakingproject in progress'
  }
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-hiking') {
    hobbyImg2x = hiking2x
    hobbyAlt =
      'An iPhone screenshot showing the DidThis application featuring a hike in progress'
  }
  if (
    !hobbyImg2x ||
    (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-woodworking')
  ) {
    // default
    hobbyImg2x = woodworking2x
  }

  const contentColX = 'max-w-[1280px] mx-auto text-center'
  // const chunks = 'mx-auto max-w-[580px] flex flex-col items-center'

  const flexPairCommon =
    'flex flex-col mb-16 md:mb-8 gap-8 md:gap-12 lg:gap-14 items-center'
  const flexPair = flexPairCommon + ' md:flex-row'
  const flexPairRev = flexPairCommon + ' md:flex-row-reverse'
  const howWorksImgCont = '' //'basis-3/5'
  const howWorksTextCont = 'text-center md:text-left basis-2/5'
  const howWorksImg = 'inline'
  const h4text = 'text-2xl md:text-3xl mt-0 mb-4'
  const para = 'text-base leading-[24px] md:text-base md:leading-[32px]'

  const handleDeferredLogin = async () => {
    store.trackEvent(trackingEvents.bcLoginTrialSignup)
    await store.loginAsNewTrialUser()
  }

  let ctaButton = (invited && store.enableDeferredSignup) ? (
    <DeferredSignupButton
      onClick={handleDeferredLogin}
      className="my-6 px-6 py-4 text-lg"
    />
  ) : (
    <>
      <div className="grid grid-cols-1 gap-4 w-full lg:grid-cols-[auto_auto_auto] items-center my-6">
        <Link
          data-testid="testflightbutton"
          className={`px-6 py-4 text-md `}
          href={branding.iOSAppStoreURLHomeUnauth}
          intent="primary"
          trackEvent={trackingEvents.bcAppStoreHP}
        >
          <strong>Get {branding.productName} for iOS</strong><br />
          <span className="text-sm">(US + Canada)</span>
        </Link>
        <div className="text-center">OR</div>
        <LoginButton
          className={`px-6 py-4 text-md `}
          intent="primary"
          content={<><strong>Try the web app</strong><br /><span className="text-sm">(Any device)</span></>}
        />
      </div>
      <p className="mb-2">
        The web app works great for Android phones, but you can also{' '}
        <WaitlistButton mode="viral" className="text-md" />{' '}
        to be notified when the native Android app is available.
      </p>
    </>
  )

  // cta is now a shutdown notice
  ctaButton = <div className="p-3 border-4 bg-white rounded mt-4 mb-4"><p>
  <strong>Important update: Didthis will be shutting down on November 15th.</strong> Please make sure to export your data before the sunset. <Link href="/sunset">Learn more here</Link>. </p></div>

  return (
    <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen">
      <AppHeader />
      <div>
        <PagePad wide noPadY>
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-14 mt-8 items-start">
            <div className="sm:max-w-[40%] text-center sm:text-left lg:self-center">
              <h4 className="text-3xl sm:text-3xl2 lg:text-4xl leading-tight md:leading-tight mb-6">
                <strong>
                  <span>Never forget a step in your passion projects</span>
                </strong>
              </h4>
              <p className="text-base">
                <span>
                  Journal your progress on your hobby journeys with images,
                  text, or links that are a snap to capture in the moment.
                  Record and reflect on the wins and setbacks, and celebrate
                  your growth. Keep your projects private, or share them with
                  the people who appreciate your process.
                </span>
              </p>
              {ctaButton}
            </div>
            <Image
              src={hobbyImg2x}
              height={hobbyImg2x.height / 2}
              width={hobbyImg2x.width / 2}
              className="mb-[-15%] sm:mb-[-10%] w-full"
              alt={hobbyAlt}
            />
          </div>
        </PagePad>
        <div className="bg-yellow-home pt-[12%] sm:pt-[4%] md:pt-[6%] lg:pt-[7%]">
          <div className={contentColX + ' py-8 md:pt-10 md:pb-16 px-8'}>
            <div className="md:max-w-[1000px] px-4 md:px-10 mx-auto">
              <h3 className="text-3xl md:text-4xl my-0 mb-8">How it works</h3>

              <div className={flexPairRev}>
                <div className={howWorksImgCont}>
                  <Image
                    src={captureProgres2x}
                    height={captureProgres2x.height / 2}
                    width={captureProgres2x.width / 2}
                    alt="a series of illustrations showing the evolution of a baking project from mixing dough, to cooking in the oven, to a finished loaf of bread"
                  />
                </div>
                <div className={howWorksTextCont}>
                  <h3 className={h4text}>Capture your progress</h3>
                  <p className={para}>
                    Use {branding.productName} on your phone to post photos,
                    links, or notes as you work on your hobby. Think of it as
                    your <strong>personal hobbyist journal.</strong>
                  </p>
                </div>
              </div>

              <div className={flexPair}>
                <div className={howWorksImgCont}>
                  <Image
                    src={worksWithAnyHobby2x}
                    height={worksWithAnyHobby2x.height / 2}
                    width={worksWithAnyHobby2x.width / 2}
                    alt="a group of project cards showing titles and photographs including: “My quest for low-sugar cookies”, “Climbing Maple Mountain”, “Living room side table”, and “A beige hand-knit sweater”"
                  />
                </div>
                <div className={howWorksTextCont}>
                  <h3 className={h4text}>Works with any hobby</h3>
                  <p className={para}>
                    Hobbies aren’t just about the final result, they’re about
                    the journey and everything you learn along the way. Use{' '}
                    {branding.productName} to track it all and{' '}
                    <strong>celebrate progress instead of perfection!</strong>
                  </p>
                </div>
              </div>

              <div className={flexPairRev}>
                <div className={howWorksImgCont}>
                  <Image
                    src={shareAndCelebrate2x}
                    width={shareAndCelebrate2x.width / 2}
                    height={shareAndCelebrate2x.height / 2}
                    className={howWorksImg}
                    alt="an illustration of a phone in a hand with outward arrows connecting to other people, indicating sharing and distribution of content from your phone"
                  />
                </div>
                <div className={howWorksTextCont}>
                  <h3 className={h4text}>Share and celebrate</h3>
                  <p className={para}>
                    Everything you post on {branding.productName} is{' '}
                    <strong>private by default.</strong> When you’re ready to
                    show your work to others, you can make your project public
                    and share it anywhere online where hobbyists gather.
                  </p>
                </div>
              </div>
              <div className="py-4" />
              {ctaButton}
            </div>
          </div>
        </div>
      </div>
      <AppFooter unauthHomepage={true} />
    </div>
  )
}

export default HomeUnauth
