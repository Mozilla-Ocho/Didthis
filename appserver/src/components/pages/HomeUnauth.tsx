import { LoginButton } from '@/components/auth/LoginButton'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import branding from '@/lib/branding'
import captureProgres2x from '@/assets/img/capture_your_progress2x.png'
import worksWithAnyHobby1x from '@/assets/img/works_with_any_hobby_1x.png'
import worksWithAnyHobby2x from '@/assets/img/works_with_any_hobby_2x.png'
import shareAndCelebrate1x from '@/assets/img/share_and_celebrate1x.png'
import shareAndCelebrate2x from '@/assets/img/share_and_celebrate2x.png'
import hiking1x from '@/assets/img/hiking_1x.png'
import hiking2x from '@/assets/img/hiking_2x.png'
import knitting1x from '@/assets/img/knitting_1x.png'
import knitting2x from '@/assets/img/knitting_2x.png'
import woodworking1x from '@/assets/img/woodworking_1x.png'
import woodworking2x from '@/assets/img/woodworking_2x.png'
import baking1x from '@/assets/img/baking_1x.png'
import baking2x from '@/assets/img/baking_2x.png'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { useEffect } from 'react'
import { WaitlistButton } from '../WaitlistButton'
import { PagePad } from '../uiLib'

// DRY_20334 outer page width styles
const HomeUnauth = () => {
  const store = useStore()
  const bucketInt = (store.testBucket ? store.testBucket.value : 0) % 5
  let topicBucket: 'combo' | 'authentic' | 'storytelling' | 'utility' | 'wip'
  // safe default to the combo bucket in case something's oddly wrong with
  // bucketInt inputs
  topicBucket = 'combo'
  if (bucketInt === 0) topicBucket = 'combo'
  if (bucketInt === 1) topicBucket = 'authentic'
  if (bucketInt === 2) topicBucket = 'storytelling'
  if (bucketInt === 3) topicBucket = 'utility'
  if (bucketInt === 4) topicBucket = 'wip'
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
      store.trackEvent(trackingEvents.waitlistHomeUnauth, { topicBucket })
    }
  })

  const invited = store.signupCodeInfo && store.signupCodeInfo.active

  let hobbyImg1x = woodworking1x
  let hobbyImg2x = woodworking2x
  let hobbyAlt = "An iPhone screenshot showing the DidThis application featuring a woodworking project in progress"
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-knitting') {
    hobbyImg1x = knitting1x
    hobbyImg2x = knitting2x
    hobbyAlt = "An iPhone screenshot showing the DidThis application featuring a knitting project in progress"
  }
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-textile') {
    hobbyImg1x = knitting1x
    hobbyImg2x = knitting2x
    hobbyAlt = "An iPhone screenshot showing the DidThis application featuring a knitting project in progress"
  }
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-woodworking') {
    // noop
  }
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-cooking') {
    hobbyImg1x = baking1x
    hobbyImg2x = baking2x
    hobbyAlt = "An iPhone screenshot showing the DidThis application featuring a bakingproject in progress"
  }
  if (store.signupCodeInfo && store.signupCodeInfo.name === 'ads-hiking') {
    hobbyImg1x = hiking1x
    hobbyImg2x = hiking2x
    hobbyAlt = "An iPhone screenshot showing the DidThis application featuring a hike in progress"
  }

  const contentColX = 'max-w-[1280px] mx-auto text-center'
  // const chunks = 'mx-auto max-w-[580px] flex flex-col items-center'

  const flexPairCommon =
    'flex flex-col mb-16 md:mb-8 gap-8 md:gap-10 items-center'
  const flexPair = flexPairCommon + ' md:flex-row'
  const flexPairRev = flexPairCommon + ' md:flex-row-reverse'
  const howWorksImgCont = '' //'basis-3/5'
  const howWorksTextCont = 'text-center md:text-left basis-2/5'
  const howWorksImg = 'inline'
  const h4text = 'text-2xl md:text-3xl mt-0 mb-4'
  const para = 'text-base leading-[24px] md:text-base md:leading-[32px]'
  const ctaButton = invited ? (
    <LoginButton className="my-6 px-6 py-4 text-lg" />
  ) : (
    <WaitlistButton />
  )
  return (
    <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen">
      <AppHeader />
      <div>
        <PagePad wide noPadY>
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-12 mt-8 items-start">
            <div className="sm:max-w-[40%] text-center sm:text-left lg:self-center">
              <h4 className="text-3xl sm:text-3xl lg:text-4xl leading-tight md:leading-tight mb-6">
                <strong>
                  {topicBucket === 'authentic' && (
                    <span>An authentic record of your passion projects</span>
                  )}
                  {topicBucket === 'utility' && (
                    <span>Never forget a step in your passion projects</span>
                  )}
                  {topicBucket === 'storytelling' && (
                    <span>Every step is a story</span>
                  )}
                  {topicBucket === 'combo' && (
                    <span>
                      Capture the authentic story of your passion projects
                    </span>
                  )}
                  {topicBucket === 'wip' && (
                    <span>
                      A work in progress is worth celebrating
                    </span>
                  )}
                </strong>
              </h4>
              <p className="text-base">
                {topicBucket === 'authentic' && (
                  <span>
                    DidThis is a positive space of your own to celebrate each
                    step, stumble, or snapshot from your hobby journeys. Embrace
                    progress over perfection! Keep your projects private or
                    share them with the people you choose.
                  </span>
                )}
                {topicBucket === 'utility' && (
                  <span>
                    Track and journal your progress through your hobby journeys.
                    Reflect and record the joys and challenges, and celebrate
                    your growth. Keep your projects private or share them with
                    the people who will delight in your process.
                  </span>
                )}
                {topicBucket === 'storytelling' && (
                  <span>
                    Track and curate the timeline of your passion projects from
                    inception to reality. Share them with the people who delight
                    in your journey or keep them private for your future self.
                  </span>
                )}
                {topicBucket === 'combo' && (
                  <span>
                    Track each victory, stumble, or simple snapshot for yourself
                    &mdash; or to share with the people who will delight in your
                    process.
                  </span>
                )}
                {topicBucket === 'wip' && (
                  <span>
                    Didthis helps you keep track of your hobby projects,
                    remember what you’ve learned and accomplished, and share
                    your achievements with friends and fellow hobbyists.
                  </span>
                )}
              </p>
              {ctaButton}
            </div>
            <Image
              src={hobbyImg2x}
              height={hobbyImg2x.height / 2}
              width={hobbyImg2x.width / 2}
              className="mb-[-15%]"
              alt={hobbyAlt}
            />
          </div>
        </PagePad>
        <div className="bg-yellow-home pt-[10%] sm:pt-[20px] md:pt-[6%] lg:pt-[8%]">
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

              <div className={flexPairRev }>
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
