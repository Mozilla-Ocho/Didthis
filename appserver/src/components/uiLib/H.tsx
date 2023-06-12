import { FC, ReactNode } from 'react'
import classNames from 'classnames'

type Props = {
  children: ReactNode
  className?: string
}

const classes = 'font-bold my-1'

interface H {
  H1: FC<Props>
  H2: FC<Props>
  H3: FC<Props>
  H4: FC<Props>
}

const H: H = {
  H1: ({ children, className }) => (
    <h1 className={classNames(classes, 'text-4xl', className)}>{children}</h1>
  ),
  H2: ({ children, className }) => (
    <h2 className={classNames(classes, 'text-3xl', className)}>{children}</h2>
  ),
  H3: ({ children, className }) => (
    <h3 className={classNames(classes, 'text-2xl', className)}>{children}</h3>
  ),
  H4: ({ children, className }) => (
    <h4 className={classNames(classes, 'text-xl', className)}>{children}</h4>
  ),
}

export default H
