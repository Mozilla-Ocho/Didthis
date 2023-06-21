import { Button } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'

const LoginButton = observer(
  ({
    overrideCodeCheck,
    overrideCodeCheckIfNoSignupCode,
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
    if (!store.signupCode) {
      overrideCodeCheck = overrideCodeCheck || overrideCodeCheckIfNoSignupCode
    }
    const handleClick = () => {
      store.launchGlobalLoginOverlay(!!overrideCodeCheck)
    }
    const defaultText = store.signupCode ? 'Create account' : 'Sign in'
    return (
      <Button
        onClick={handleClick}
        intent={intent}
        loading={store.loginButtonsSpinning}
        data-testid={dataTestid || 'loginButton'}
      >
        {text || defaultText}
      </Button>
    )
  }
)

export { LoginButton }
