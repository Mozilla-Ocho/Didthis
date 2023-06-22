import { FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const inputCVA = cva(
  //'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
  'form-textarea block w-full rounded-sm border border-form-borders focus:ring-blue-500 focus:border-blue-500 text-bm',
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

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof inputCVA> & {
    error?: false | string
  }

const Textarea: FC<Props> = ({
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
      <textarea
        className={twMerge(inputCVA({}), className, errorClass)}
        {...props}
      >
        {children}
      </textarea>
      {!!error && (
        <div className="absolute text-red-400 text-right text-xs right-0">
          {error}
        </div>
      )}
    </div>
  )
}

export default Textarea
