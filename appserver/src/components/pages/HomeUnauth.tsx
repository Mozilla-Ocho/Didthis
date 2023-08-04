import { LoginButton } from '@/components/auth/LoginButton'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import branding from '@/lib/branding'
import phoneHeroDk from '@/assets/img/dk-hero-img2x.png'
import phoneHeroMb from '@/assets/img/mb-hero-img2x.png'
import captureProgressDk from '@/assets/img/dk-capture-your-progress-img2x.png'
import captureProgressMb from '@/assets/img/mb-capture-your-progress-img2x.png'
import worksWithAnyHobbyDk from '@/assets/img/dk-works-with-any-hobby-img2x.png'
import worksWithAnyHobbyMb from '@/assets/img/mb-works-with-any-hobby-img2x.png'
import shareCelebDesktop from '@/assets/img/share-and-celebrate-desktop-crop.png'
import shareCelebMobile from '@/assets/img/share-and-celebrate-img-mobile-crop.png'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import { useEffect } from 'react'
import {WaitlistButton} from '../WaitlistButton'

// DRY_20334 outer page width styles
const HomeUnauth = () => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvHomeUnauth)
  useEffect(() => {
    // special tracking event for campaign conversion, if user viewed unauth
    // landing page unauth with a valid sign up code, mark that, and we'll
    // put it in a funnel with a signup (or authSession) event.
    if (store.signupCodeInfo && store.signupCodeInfo.active) {
      store.trackEvent(trackingEvents.validCodeHomeUnauth, {
        signupCodeName: store.signupCodeInfo.name,
      })
    }
  })

  const invited = store.signupCodeInfo && store.signupCodeInfo.active
  const contentColX = 'max-w-[1280px] mx-auto text-center'
  const chunks = 'mx-auto max-w-[580px] flex flex-col items-center'

  const flexPairCommon =
    'flex flex-col mb-16 md:mb-8 gap-8 md:gap-10 items-center'
  const flexPair = flexPairCommon + ' md:flex-row'
  const flexPairRev = flexPairCommon + ' md:flex-row-reverse'
  const howWorksImgCont = ''//'basis-3/5'
  const howWorksTextCont = 'text-center md:text-left basis-2/5'
  const howWorksImg = 'inline'
  const h2text = 'text-4xl md:text-5xl my-0'
  const h3text = 'text-3xl md:text-4xl mt-0 mb-4'
  const para = 'text-md leading-[24px] md:text-lg md:leading-[32px]'
  const ctaButton = invited ? <LoginButton className="my-6 px-6 py-4 text-lg" /> : <WaitlistButton />
  return (
    <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen">
      <AppHeader />
      <div className="bg-yellow-home">
        <div className={contentColX + ' py-8 md:py-10 px-4'}>
          <div className={chunks}>
            <p className="text-4xl md:text-5xl">
              <strong>A work in progress is worth celebrating.</strong>
            </p>
            {ctaButton}
            <picture>
              <source
                media="(min-width: 640px)"
                srcSet={phoneHeroDk.src + ' 2x'}
                height={phoneHeroDk.height / 2}
                width={phoneHeroDk.width / 2}
              />
              <source
                media="(max-width: 639px)"
                srcSet={phoneHeroMb.src + ' 2x'}
                height={phoneHeroMb.height / 2}
                width={phoneHeroMb.width / 2}
              />
              <img
                src={phoneHeroMb.src}
                height={phoneHeroMb.height / 2}
                width={phoneHeroMb.width / 2}
                alt="an iPhone screen of a user’s project page with snapshots of their woodworking project to build a step stool"
              />
            </picture>
          </div>
        </div>
        <div className="bg-white">
          <div className={contentColX + ' py-8 md:py-6 px-8'}>
            <div className={chunks}>
              <h2 className={h2text + 'mb-4 md:mb-6'}>What is {branding.productName}?</h2>
              <p className={para}>
                {branding.productName} helps you keep track of your hobby
                projects, remember what you’ve learned and accomplished, and
                share your achievements with friends and fellow hobbyists.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-home-light">
          <div className={contentColX + ' py-8 md:pt-10 md:pb-16 px-8'}>
            <div className="md:max-w-[1000px] px-4 md:px-10 mx-auto">
              <h2 className={h2text + ' mb-8'}>How it works</h2>

              <div className={flexPairRev}>
                <div className={howWorksImgCont}>
                  <picture>
                    <source
                      media="(min-width: 640px)"
                      srcSet={captureProgressDk.src + ' 2x'}
                      height={captureProgressDk.height / 2}
                      width={captureProgressDk.width / 2}
                    />
                    <source
                      media="(max-width: 639px)"
                      srcSet={captureProgressMb.src + ' 2x'}
                      height={captureProgressMb.height / 2}
                      width={captureProgressMb.width / 2}
                    />
                    <img
                      src={captureProgressMb.src}
                      height={captureProgressMb.height / 2}
                      width={captureProgressMb.width / 2}
                      alt="a series of screenshots showing the evolution of a party stickers project from design concept to printing, with text, links, and images"
                    />
                  </picture>
                </div>
                <div className={howWorksTextCont}>
                  <h3 className={h3text}>Capture your progress</h3>
                  <p className={para}>
                    Use {branding.productName} on your phone to post photos,
                    links, or notes as you work on your hobby. Think of it as
                    your <strong>personal hobbyist journal.</strong>
                  </p>
                </div>
              </div>

              <div className={flexPair}>
                <div className={howWorksImgCont}>
                  <picture>
                    <source
                      media="(min-width: 640px)"
                      srcSet={worksWithAnyHobbyDk.src + ' 2x'}
                      height={worksWithAnyHobbyDk.height / 2}
                      width={worksWithAnyHobbyDk.width / 2}
                    />
                    <source
                      media="(max-width: 639px)"
                      srcSet={worksWithAnyHobbyMb.src + ' 2x'}
                      height={worksWithAnyHobbyMb.height / 2}
                      width={worksWithAnyHobbyMb.width / 2}
                    />
                    <img
                      src={worksWithAnyHobbyMb.src}
                      height={worksWithAnyHobbyMb.height / 2}
                      width={worksWithAnyHobbyMb.width / 2}
                      alt="a group of project cards showing titles and photographs including: “My quest for low-sugar cookies”, “Climbing Maple Mountain”, “Living room side table”, and “A beige hand-knit sweater”"
                    />
                  </picture>
                </div>
                <div className={howWorksTextCont}>
                  <h3 className={h3text}>Works with any hobby</h3>
                  <p className={para}>
                    Hobbies aren’t just about the final result, they’re about
                    the journey and everything you learn along the way. Use{' '}
                    {branding.productName} to track it all and{' '}
                    <strong>celebrate progress instead of perfection!</strong>
                  </p>
                </div>
              </div>

              <div className={flexPairRev + " !mb-0"}>
                <div className={howWorksImgCont}>
                  <Image
                    src={shareCelebMobile}
                    className={howWorksImg + ' md:hidden'}
                    alt="a group of social media app icons including Reddit, Facebook, Instagram, Twitter, TikTok, Discord, and Slack"
                  />
                  <Image
                    src={shareCelebDesktop}
                    className={howWorksImg + ' hidden md:inline my-24 ml-8'}
                    alt="a group of social media app icons including Reddit, Facebook, Instagram, Twitter, TikTok, Discord, and Slack"
                  />
                </div>
                <div className={howWorksTextCont}>
                  <h3 className={h3text}>Share and celebrate</h3>
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
