import { FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const mkClassName = cva(
  'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
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

const Textarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  onClick,
  children,
  ...props
}) => {
  return (
    <textarea className={mkClassName({})} {...props}>
      {children}
    </textarea>
  )
}

export default Textarea
