import { Button } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import branding from '@/lib/branding'
import useAppShell from '@/lib/appShellContent'

const LoginButton = observer(
  ({
    intent,
    text,
    content,
    'data-testid': dataTestid,
    className,
  }: {
    overrideCodeCheck?: boolean
    overrideCodeCheckIfNoSignupCode?: boolean
    intent?: React.ComponentProps<typeof Button>['intent']
    content?: React.ReactNode
    text?: string
    'data-testid'?: string
    className?: string
  }) => {
    const store = useStore()
    const appShell = useAppShell()
    const handleClick = async () => {
      store.trackEvent(trackingEvents.bcLoginSignup)
      if (appShell.appReady) {
        await appShell.api.request('signin')
      } else {
        store.launchGlobalLoginOverlay(false)
      }
    }
    const defaultText = branding.loginButtonTxt
    return (
      <Button
        onClick={handleClick}
        intent={intent}
        data-testid={dataTestid || 'loginButton'}
        className={className}
      >
        {content || text || defaultText}
      </Button>
    )
  }
)

export { LoginButton }
