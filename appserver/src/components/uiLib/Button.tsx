import { ReactNode, FC, MouseEventHandler } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const buttonCVA = cva(
  'button px-4 py-3 rounded text-bs',
  {
    variants: {
      intent: {
        primary: [
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
          'text-bs',
          'hover:text-links-hover',
          'active:text-links-active',
          'p-0',
        ],
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonCVA> {
  children: ReactNode
  className?: string
  type?: 'submit' | undefined
  onClick?: React.MouseEventHandler
  loading?: boolean // XXX_PORTING
  'data-testid'?: string // XXX_PORTING
  disabled?: boolean
}

const Button: FC<ButtonProps> = ({
  onClick,
  children,
  intent,
  className,
  disabled,
  ...props
}) => {
  const bType = props.type || 'button'
  const ourOnClick: MouseEventHandler = e => {
    if (onClick) onClick(e)
  }
  return (
    <button
      type={bType}
      className={twMerge(buttonCVA({ intent }), className)}
      onClick={ourOnClick}
      disabled={!!disabled}
    >
      {children}
    </button>
  )
}

export default Button
