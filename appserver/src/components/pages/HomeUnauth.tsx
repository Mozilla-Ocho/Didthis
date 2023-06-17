import { H, Divider } from '@/components/uiLib'
import { LoginButton } from '@/components/auth/LoginButton'

const HomeUnauth = () => {
  return (
    <>
      <div>
        <H.H1>HOBBYR</H.H1>
        <Divider />
        <p>celebrate your progress on your passion projects</p>
        <p>...screenshots n stuff...</p>
        <Divider />
        <LoginButton />
      </div>
    </>
  )
}

export default HomeUnauth
