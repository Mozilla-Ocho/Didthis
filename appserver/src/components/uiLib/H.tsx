import { FC, ReactNode } from 'react'
import classNames from 'classnames'

type Props = {
  children: ReactNode
}

const classes = 'font-bold my-1'

interface H {
  H1: FC<Props>
  H2: FC<Props>
  H3: FC<Props>
  H4: FC<Props>
}

const H: H = {
  H1: ({ children }) => (
    <h1 className={classNames(classes, 'text-4xl')}>{children}</h1>
  ),
  H2: ({ children }) => (
    <h2 className={classNames(classes, 'text-3xl')}>{children}</h2>
  ),
  H3: ({ children }) => (
    <h3 className={classNames(classes, 'text-2xl')}>{children}</h3>
  ),
  H4: ({ children }) => (
    <h4 className={classNames(classes, 'text-xl')}>{children}</h4>
  ),
}

export default H
