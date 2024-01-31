import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { useCallback, useEffect, useState } from 'react'

const APPLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || 'org.mozilla.Didthis.web'

// see: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple
const EVENT_APPLE_ID_SUCCESS = 'AppleIDSignInOnSuccess'
const EVENT_APPLE_ID_FAILURE = 'AppleIDSignInOnFailure'

// https://developer.apple.com/documentation/sign_in_with_apple/displaying_sign_in_with_apple_buttons_on_the_web
type AppleSignInProps = {
  width?: string
  height?: string
  buttonBorder?: boolean
  buttonColor?: 'white' | 'black'
  buttonMode?: 'center-align' | 'left-align' | 'logo-only'
  buttonType?: 'sign-in' | 'continue' | 'sign-up'
  logoSize?: 'small' | 'medium' | 'large'
  onSuccess?: (ev: AppleIDSignInSuccessEvent) => void
  onFailure?: (ev: AppleIDSignInFailureEvent) => void
}

// TODO: the Apple ID global JS include expects a single element
// <div id="appleid-signin" /> somewhere on the page. So, this component
// can only be used once - any subsequent appearances will be blank div's
// Find a way to work around this or manage showing just one at a time

const AppleSignIn = observer(
  ({
    width = '198',
    height = '48',
    buttonBorder = true,
    buttonColor = 'black',
    buttonMode = 'center-align',
    buttonType = 'sign-in',
    logoSize = 'small',
    onSuccess,
    onFailure,
  }: AppleSignInProps) => {
    const store = useStore()
    const [showAppleIdButton, setShowAppleIdButton] = useState(false)

    const handleAuthSuccess = useCallback(
      (event: AppleIDSignInSuccessEvent) => {
        const authorization = event.detail?.authorization
        if (authorization) {
          onSuccess?.(event)
          store.loginWithAppleId({
            identityToken: authorization.id_token,
            authorizationCode: authorization.code,
            state: authorization.state,
          })
        }
      },
      [store, onSuccess]
    )

    const handleAuthFailure = useCallback(
      (event: AppleIDSignInFailureEvent) => {
        // TODO: Handle error.
        onFailure?.(event)
        window.alert('Sign in with Apple failed, please try again later.')
        console.error('FAILURE', event)
      },
      [onFailure]
    )

    useEffect(() => {
      // Try to account for window being undefined in server-side render, but
      // cast into type including Apple's JS global if defined
      const windowWithAppleID =
        typeof window !== 'undefined'
          ? (window as typeof window & { AppleID?: AppleIDGlobal })
          : undefined
      const AppleID = windowWithAppleID?.AppleID

      // Bail out if there's no AppleID global
      if (typeof AppleID === 'undefined') return

      if (!showAppleIdButton) {
        // Trigger a render to show the button, before auth init
        setShowAppleIdButton(true)
        return
      }

      document.addEventListener(EVENT_APPLE_ID_SUCCESS, handleAuthSuccess)
      document.addEventListener(EVENT_APPLE_ID_FAILURE, handleAuthFailure)

      // Figure out a proper redirect URI for Apple ID
      const host = location.host
      const baseUrl = new URL(`https://${host}`)
      const redirectURI = new URL(
        `/api/acceptAppleSignInRedirect`,
        baseUrl
      ).toString()

      // Finally, initialize AppleID auth
      AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI,
        usePopup: true,
      })

      return () => {
        document.removeEventListener(EVENT_APPLE_ID_SUCCESS, handleAuthSuccess)
        document.removeEventListener(EVENT_APPLE_ID_FAILURE, handleAuthFailure)
      }
    }, [
      handleAuthSuccess,
      handleAuthFailure,
      showAppleIdButton,
      setShowAppleIdButton,
    ])

    if (!showAppleIdButton) return null

    return (
      <div
        id="appleid-signin"
        className="signin-button my-4"
        data-type={buttonType}
        data-mode={buttonMode}
        data-border={buttonBorder ? 'true' : 'false'}
        data-color={buttonColor}
        data-logo-size={logoSize}
        data-width={width}
        data-height={height}
      ></div>
    )
  }
)

export default AppleSignIn

// see also: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple

type AppleIDGlobal = {
  auth: AppleIDAuthI
}

// https://developer.apple.com/documentation/sign_in_with_apple/authi
type AppleIDAuthI = {
  init: (config: AppleIDClientConfigI) => void
  signIn: (config: AppleIDClientConfigI) => Promise<void>
  renderButton: () => void
}

// https://developer.apple.com/documentation/sign_in_with_apple/clientconfigi
type AppleIDClientConfigI = {
  clientId: string
  redirectURI: string
  scope: string
  state?: string
  nonce?: string
  usePopup?: boolean
}

type AppleIDSignInSuccessEvent = Event & {
  detail?: {
    authorization: {
      code: string
      id_token: string
      state?: string
    }
  }
}

type AppleIDSignInFailureEvent = Event & {
  detail?: {
    error: string
  }
}
