
import { LoginButton } from '@/components/auth/LoginButton'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import branding from '@/lib/branding'
import phoneHero from '@/assets/img/hero-img-desktop.png'
import captureProgressPhone from '@/assets/img/capture-your-progress-img-desktop.png'
import worksHobby from '@/assets/img/works-with-any-hobby-img-desktop.png'
import shareCelebDesktop from '@/assets/img/share-and-celebrate-desktop-crop.png'
import shareCelebMobile from '@/assets/img/share-and-celebrate-img-mobile-crop.png'
import Image from 'next/image'
import {useStore} from '@/lib/store'
import {trackingEvents} from '@/lib/trackingEvents'

// DRY_20334 outer page width styles
const HomeUnauth = () => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvHomeUnauth)

  const contentColX = 'max-w-[1280px] mx-auto text-center'
  const chunks = 'mx-auto max-w-[580px] flex flex-col items-center'

  const flexPairCommon =
    'flex flex-col mb-16 md:mb-8 gap-8 md:gap-0 items-center'
  const flexPair = flexPairCommon + ' md:flex-row'
  const flexPairRev = flexPairCommon + ' md:flex-row-reverse'
  const howWorksImgCont = 'basis-3/5'
  const howWorksTextCont = 'text-center md:text-left basis-2/5'
  const howWorksImg = 'inline'
  const h2text = 'text-4xl md:text-5xl'
  const h3text = 'text-3xl md:text-4xl'
  const para = 'text-md leading-[24px] md:text-lg md:leading-[32px]'
  return (
    <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen">
      <AppHeader />
      <div className="bg-yellow-home">
        <div className={contentColX + ' pt-5 pb-10 px-4'}>
          <div className={chunks}>
            <p className="text-5xl md:text-6xl">
              You’ve been invited to join{' '}
              <strong>{branding.productName}</strong>
            </p>
            <Image
              src={phoneHero}
              alt="an iPhone screen of a user’s project page with snapshots of their woodworking project to build a step stool"
            />
            <LoginButton />
          </div>
        </div>
        <div className="bg-white">
          <div className={contentColX + ' py-10 px-8'}>
            <div className={chunks}>
              <h2 className={h2text}>What is {branding.productName}?</h2>
              <p className={para}>
                {branding.productName} helps you keep track of your hobby
                projects, remember what you’ve learned and accomplished, and
                share your achievements with friends and fellow hobbyists.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-home-light">
          <div className={contentColX + ' pt-10 pb-16 px-8'}>
            <div className="md:max-w-[1000px] px-4 md:px-10 mx-auto">
              <h2 className={h2text + " mb-8"}>How it works</h2>

              <div className={flexPairRev}>
                <div className={howWorksImgCont}>
                  <Image
                    src={captureProgressPhone}
                    className={howWorksImg}
                    alt="an iPhone screenshot of a user talking about how the party stickers they ordered turned out"
                  />
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
                  <Image
                    src={worksHobby}
                    className={howWorksImg}
                    alt="a group of project cards showing titles and photographs including: “My quest for sugar free granola”, “Climbing Maple Mountain”, “Living room side table”, and “A beige hand-knit sweater”"
                  />
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

              <div className={flexPairRev}>
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
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
      <AppFooter unauthHomepage={true} />
    </div>
  )
}

export default HomeUnauth
