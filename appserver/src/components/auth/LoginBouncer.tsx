import {PagePad} from "../uiLib"
import {LoginButton} from "./LoginButton"

const LoginBouncer = () => {
  return (
    <PagePad>
      <h4 className="my-8">Sign in required</h4>
      <p className="my-8">To access this page, please sign in.</p>
      <LoginButton />
    </PagePad>
  )
}

export default LoginBouncer
