import { FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const inputCVA = cva(
  //'inline-block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
  'form-input block w-full border border-form-borders rounded-sm focus:ring-blue-500 focus:border-blue-500 text-base',
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
    customError?: false | string
    required?: boolean
    touched?: boolean
    maxLen?: number
    minLen?: number
  }

const Input: FC<Props> = ({
  onClick,
  children,
  className,
  customError,
  required,
  touched,
  maxLen,
  minLen,
  ...props
}) => {
  let error = ''
  let info = ''
  const empty = ((props.value || '') + '').trim() === ''
  const chars = ((props.value || '') + '').trim().length
  if (customError) {
    error = customError
  } else {
    info = required ? 'required' : ''
    if (maxLen) {
      info = info + ` (${chars}/${maxLen})`
    }
    if (required && touched && empty) {
      error = 'required'
    }
    if (touched && maxLen && chars > maxLen) {
      error = `too long (${chars}/${maxLen})`
    }
    if (touched && minLen && chars < minLen) {
      error = `too short (${chars}/${maxLen})`
    }
  }
  const errorClass = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : ''
  return (
    <div>
      <input
        className={twMerge(inputCVA({}), className, errorClass)}
        {...props}
      >
        {children}
      </input>
      {!!error && (
        <div className="relative h-0 text-red-400 text-right text-xs right-0">
          {error}
        </div>
      )}
      {!error && info && (
        <div className="relative h-0 text-form-labels text-right text-xs right-0">
          {info}
        </div>
      )}
    </div>
  )
}

export default Input
