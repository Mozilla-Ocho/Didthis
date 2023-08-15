import { Button } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import branding from '@/lib/branding'

const DeferredSignupButton = observer(
  ({
    intent,
    text,
    'data-testid': dataTestid,
    className,
  }: {
    overrideCodeCheck?: boolean
    overrideCodeCheckIfNoSignupCode?: boolean
    intent?: React.ComponentProps<typeof Button>['intent']
    text?: string
    'data-testid'?: string
    className?: string
  }) => {
    const store = useStore()
    const handleClick = () => {
      store.trackEvent(trackingEvents.bcLoginSignup)
      store.launchGlobalLoginOverlay(false)
    }
    return (
      <Button
        onClick={handleClick}
        intent={intent}
        data-testid={dataTestid || 'DeferredSignupButton'}
        className={className}
      >
        {text || branding.signupButtonTxt}
      </Button>
    )
  }
)

export { DeferredSignupButton }
