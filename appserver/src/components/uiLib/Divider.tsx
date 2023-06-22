import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface DividerProps {
  className?: string
  light?: boolean
}
const Divider: FC<DividerProps> = ({ className, light }) => {
  return (
    <hr
      className={twMerge(
        'my-4 border-edge-gray border-0 border-t',
        light && 'border-edge-gray-light',
        className
      )}
    />
  )
}

export default Divider
