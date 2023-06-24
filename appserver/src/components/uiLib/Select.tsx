import { FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const selectCVA = cva(
  // 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
  'form-select block w-full border border-form-borders rounded-sm focus:ring-blue-500 focus:border-blue-500 text-base',
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

type Props = React.SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof selectCVA> & {
    error?: false | string
  }

const Select: FC<Props> = ({
  onClick,
  children,
  className,
  error,
  ...props
}) => {
  const errorClass = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : ''
  return (
    <div className="relative">
      <select
        className={twMerge(selectCVA({}), className, errorClass)}
        {...props}
      >
        {children}
      </select>
      {!!error && (
        <div className="absolute text-red-400 text-right text-xs right-0">
          {error}
        </div>
      )}
    </div>
  )
}

export default Select
