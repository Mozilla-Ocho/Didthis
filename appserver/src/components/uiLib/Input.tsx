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
    greenText?: string
    checkingText?: string
    required?: boolean
    touched?: boolean
    maxLen?: number
    minLen?: number
    hideLengthUnlessViolated?: boolean
    justTheInputOnly?: boolean
  }

const Input: FC<Props> = ({
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  onClick = () => {},
  children,
  className,
  customError,
  greenText,
  checkingText,
  required,
  touched,
  maxLen,
  minLen,
  hideLengthUnlessViolated,
  justTheInputOnly,
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
    if (maxLen && !hideLengthUnlessViolated) {
      info = info + ` (${chars}/${maxLen})`
    }
    if (required && touched && empty) {
      error = 'required'
    } else if (touched && maxLen && chars > maxLen) {
      error = `too long (${chars}/${maxLen})`
    } else if (touched && minLen && chars < minLen) {
      error = `too short (${chars}/${maxLen})`
    }
  }
  const errorClass = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : ''
  const theInput = (
    <input className={twMerge(inputCVA({}), className, errorClass)} {...props}>
      {children}
    </input>
  )
  if (justTheInputOnly) return theInput
  return (
    <div>
      <input
        onClick={onClick}
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
      {!error && (info || greenText || checkingText) && (
        <div className="relative h-0 text-form-labels text-right text-xs right-0">
          {greenText && <span className="text-green-500">{greenText}</span>}
          {checkingText && (
            <span className="text-black-200">{checkingText}</span>
          )}
          {info}
        </div>
      )}
    </div>
  )
}

export default Input
