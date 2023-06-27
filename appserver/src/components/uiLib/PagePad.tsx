import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const PagePad = ({
  children,
  className,
  wide,
}: {
  children: ReactNode
  className?: string
  wide?: boolean
}) => (
  <div
    className={twMerge(
      'w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16',
      className
    )}
  >
    {wide ? children : <div className="max-w-[450px]">{children}</div>}
  </div>
)

export default PagePad
