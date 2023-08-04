import { ReactNode, FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import Spinner from './Spinner'
import { useStore } from '@/lib/store'

const buttonCVA = cva('button px-4 py-3 rounded text-sm', {
  variants: {
    intent: {
      primary: [
        // DRY_57530 button styles
        'bg-primary-bg',
        'hover:bg-primary-bg-hover',
        'active:bg-primary-bg-active',
        'disabled:bg-primary-bg-disabled',
        'text-primary-txt',
        'hover:text-primary-txt-hover',
        'active:text-primary-txt-active',
        'disabled:text-primary-txt-disabled',
      ],
      secondary: [
        // DRY_57530 button styles
        'bg-secondary-bg',
        'hover:bg-secondary-bg-hover',
        'active:bg-secondary-bg-active',
        'disabled:bg-secondary-bg-disabled',
        'text-secondary-txt',
        'hover:text-secondary-txt-hover',
        'active:text-secondary-txt-active',
        'disabled:text-secondary-txt-disabled',
        'border',
        'border-secondary-edge',
        'hover:border-secondary-edge-hover',
        'disabled:border-secondary-edge-disabled',
      ],
      link: [
        'underline',
        'text',
        'text-links',
        'hover:text-links-hover',
        'active:text-links-active',
        'p-0',
      ],
      headerNav: [
        'underline',
        'text',
        'text-links',
        'text-sm',
        'hover:text-links-hover',
        'active:text-links-active',
        'p-0',
      ],
    },
  },
  defaultVariants: {
    intent: 'primary',
  },
})

interface ButtonProps extends VariantProps<typeof buttonCVA> {
  children: ReactNode
  className?: string
  type?: 'submit' | undefined
  onClick?: React.MouseEventHandler
  loading?: boolean
  'data-testid'?: string
  disabled?: boolean
  spinning?: boolean
  trackEvent?: EventSpec
  trackEventOpts?: EventSpec['opts']
  id?: string
}

const Button: FC<ButtonProps> = ({
  type,
  onClick,
  children,
  intent,
  className,
  disabled,
  spinning,
  loading,
  trackEvent,
  trackEventOpts,
  ...props
}) => {
  const bType = type || 'button'
  const store = useStore()
  const ourOnClick: React.MouseEventHandler = e => {
    if (trackEvent) store.trackEvent(trackEvent, trackEventOpts)
    if (onClick) onClick(e)
  }
  return (
    <button
      type={bType}
      className={twMerge('relative', buttonCVA({ intent }), className)}
      onClick={ourOnClick}
      disabled={!!disabled || !!spinning || !!loading}
      {...props}
    >
      <span className={spinning || loading ? 'opacity-0' : ''}>{children}</span>
      {(spinning || loading) && (
        <span className="absolute top-[50%] left-[50%]">
          <span className="inline-block -translate-y-1/2 -translate-x-1/2">
            <Spinner />
          </span>
        </span>
      )}
    </button>
  )
}

export default Button
