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
    customError?: false | string
    required?: boolean
    touched?: boolean
    maxLen?: number
    minLen?: number
    autoGrow?: boolean
  }

const Textarea: FC<Props> = ({
  onClick,
  className,
  customError,
  required,
  touched,
  maxLen,
  minLen,
  autoGrow,
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
    <div className="textarea-grow">
      <textarea
        className={twMerge(inputCVA({}), className, errorClass)}
        {...props}
      />
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
      <pre>
        {props.value}
        <br />
      </pre>
    </div>
  )
}

export default Textarea
