import { H, Divider } from '@/components/uiLib'
import { LoginButton } from '@/components/auth/LoginButton'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

const HomeUnauth = () => {
  return (
    <div className="max-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <AppHeader />
      <div className="bg-yellow-home-light">
        <div className="bg-yellow-home p-4 text-center">
          <p className="text-5xl">You’ve been invited to join</p>
          <H.H1>Dabbler</H.H1>
          <LoginButton />
          <H.H4>What is Dabbler?</H.H4>
          <p>lorum ipsum</p>
        </div>
        <div className="bg-yellow-home-light p-4 text-center">
          <H.H4>How does it work?</H.H4>
          <p>lorum ipsum</p>
          <LoginButton />
        </div>
      </div>
      <AppFooter unauthHomepage={true} />
    </div>
  )
}

export default HomeUnauth
