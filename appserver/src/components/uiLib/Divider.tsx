import { FC } from 'react'
import cx from 'classnames'

interface DividerProps {
  className?: string
}
const Divider: FC<DividerProps> = ({ className }) => {
  return <hr className={cx('my-3 border-black border-0 border-t', className)} />
}

export default Divider
