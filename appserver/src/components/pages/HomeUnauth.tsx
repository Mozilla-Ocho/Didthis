import { H, Divider } from '@/components/uiLib'
import { LoginButton } from '@/components/auth/LoginButton'

const HomeUnauth = () => {
  return (
    <>
      <div className="bg-yellow-home p-4 text-center">
        <p className="text-h2">You’ve been invited to join</p>
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

      </>
  )
}

export default HomeUnauth
