import { Button } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import {trackingEvents} from '@/lib/trackingEvents'

const LoginButton = observer(
  ({
    intent,
    text,
    'data-testid': dataTestid,
  }: {
    overrideCodeCheck?: boolean
    overrideCodeCheckIfNoSignupCode?: boolean
    intent?: React.ComponentProps<typeof Button>['intent']
    text?: string
    'data-testid'?: string
  }) => {
    const store = useStore()
    const handleClick = () => {
      store.trackEvent(trackingEvents.bcLoginSignup)
      store.launchGlobalLoginOverlay(false)
    }
    const defaultText = store.signupCodeInfo ? 'Create account' : 'Sign in'
    return (
      <Button
        onClick={handleClick}
        intent={intent}
        data-testid={dataTestid || 'loginButton'}
      >
        {text || defaultText}
      </Button>
    )
  }
)

export { LoginButton }
