import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface DividerProps {
  className?: string
}
const Divider: FC<DividerProps> = ({ className }) => {
  return <hr className={twMerge('my-3 border-edge-gray border-0 border-t',className)} />
}

export default Divider
