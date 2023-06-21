import { ReactNode, FC, MouseEventHandler } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const buttonCVA = cva(
  'button p-4 py-2 px-4 rounded text-white disabled:bg-slate-300',
  {
    variants: {
      intent: {
        primary: [
          'bg-yellow-500',
          'hover:bg-yellow-300',
          'text-black-700',
          'active:bg-yellow-700',
          'active:text-black-100',
          'disabled:bg-black-100',
          'disabled:text-black-300',
        ],
        secondary: [
          'bg-white',
          'border',
          'rounded',
          'hover:bg-white',
          'border-black-700',
          'border-black-700',
          'text-black-700',
          'hover:border-black-300',
          'hover:text-black-300',
          'active:border-black-700',
          'active:text-black-700',
          'disabled:border-black-100',
          'disabled:text-black-100',
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
      size: {
        small: ['text-sm'],
        medium: ['text-base'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
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
  size,
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
      className={twMerge(buttonCVA({ intent, size }), className)}
      onClick={ourOnClick}
      disabled={!!disabled}
    >
      {children}
    </button>
  )
}

export default Button
