
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

// DRY_20334 outer page width styles

const PagePad = ({
  children,
  className,
  wide,
  semiWide,
  noPadY,
  narrowColControlOnly,
  yControlOnly,
}: {
  children: ReactNode
  className?: string
  wide?: boolean
  semiWide?: boolean
  noPadY?: boolean
  narrowColControlOnly?: boolean
  yControlOnly?: boolean
}) => {
  if (yControlOnly) {
    return (
      <div className={twMerge('pt-4 pb-16', className)}>{children}</div>
    )
  }
  if (narrowColControlOnly) {
    return (
      <div className={twMerge('sm:max-w-[450px]', className)}>{children}</div>
    )
  }
  const maxW = semiWide ? "sm:max-w-[650px]" : wide ? "" : "sm:max-w-[450px]"
  return (
    <div
      className={twMerge(
        'w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16',
        noPadY ? '' : 'pt-4 pb-16',
        className
      )}
    >
      {maxW ? <div className={maxW}>{children}</div> : children}
    </div>
  )
}

export default PagePad
