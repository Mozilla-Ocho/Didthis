import { FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const selectCVA = cva(
  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
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

const Select: FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  onClick,
  children,
  ...props
}) => {
  return (
    <select className={selectCVA({})} {...props}>
      {children}
    </select>
  )
}

export default Select
