import { LoginButton } from '@/components/auth/LoginButton'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

// DRY_20334 outer page width styles
const HomeUnauth = () => {
  return (
    <div className="max-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <AppHeader />
      <div className="bg-yellow-home-light">
        <div className="bg-yellow-home p-4 text-center">
          <p className="text-5xl">You’ve been invited to join</p>
          <h1>Dabbler</h1>
          <LoginButton />
          <h4>What is Dabbler?</h4>
          <p>lorum ipsum</p>
        </div>
        <div className="bg-yellow-home-light p-4 text-center">
          <h4>How does it work?</h4>
          <p>lorum ipsum</p>
          <LoginButton />
        </div>
      </div>
      <AppFooter unauthHomepage={true} />
    </div>
  )
}

export default HomeUnauth
