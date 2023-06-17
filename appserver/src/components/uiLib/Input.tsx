import { FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const inputCVA = cva(
  'inline-block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
  {
    variants: {
      intent: {
        primary: [],
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
)

type Props = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputCVA> & {
    error?: false | string
  }

const Input: FC<Props> = ({
  onClick,
  children,
  className,
  error,
  ...props
}) => {
  const errorClass = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-300 dark:focus:ring-red-500 dark:focus:border-red-500'
    : ''
  return (
    <div className="relative">
      <input
        className={twMerge(inputCVA({}), className, errorClass)}
        {...props}
      >
        {children}
      </input>
    {!!error && <div className="absolute text-red-400 text-right text-xs right-0">{error}</div>}
    </div>
  )
}

export default Input
