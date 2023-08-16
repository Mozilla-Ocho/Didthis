import { Button } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import branding from '@/lib/branding'
import { MouseEventHandler } from 'react'

const DeferredSignupButton = observer(
  ({
    onClick,
    intent,
    text,
    'data-testid': dataTestid,
    className,
  }: {
    onClick?: MouseEventHandler<Element>,
    intent?: React.ComponentProps<typeof Button>['intent']
    text?: string
    'data-testid'?: string
    className?: string
  }) => {
    return (
      <Button
        onClick={onClick}
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
