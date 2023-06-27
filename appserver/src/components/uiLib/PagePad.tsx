import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

// DRY_20334 outer page width styles

const PagePad = ({
  children,
  className,
  wide,
  noPadY,
}: {
  children: ReactNode
  className?: string
  wide?: boolean
  noPadY?: boolean
}) => (
  <div
    className={twMerge(
      'w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16',
      noPadY ? '' : 'pt-4 pb-16',
      className
    )}
  >
    {wide ? children : <div className="sm:max-w-[450px]">{children}</div>}
  </div>
)

export default PagePad
