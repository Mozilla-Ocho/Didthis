import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  children: ReactNode
  className?: string
}

const classes = 'font-bold my-1'

interface H {
  HLogo: FC<Props>
  H1: FC<Props>
  H2: FC<Props>
  H3: FC<Props>
  H4: FC<Props>
  H5: FC<Props>
}

const H: H = {
  HLogo: ({ children, className }) => (
    <h1 className={twMerge(classes, 'text-h4 leading-none', className)}>{children}</h1>
  ),
  H1: ({ children, className }) => (
    <h1 className={twMerge(classes, 'text-h1', className)}>{children}</h1>
  ),
  H2: ({ children, className }) => (
    <h2 className={twMerge(classes, 'text-h2', className)}>{children}</h2>
  ),
  H3: ({ children, className }) => (
    <h3 className={twMerge(classes, 'text-h3', className)}>{children}</h3>
  ),
  H4: ({ children, className }) => (
    <h4 className={twMerge(classes, 'text-h4', className)}>{children}</h4>
  ),
  H5: ({ children, className }) => (
    <h4 className={twMerge(classes, 'text-h5', className)}>{children}</h4>
  ),
}

export default H
