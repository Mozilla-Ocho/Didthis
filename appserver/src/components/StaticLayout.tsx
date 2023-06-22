import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import type { ReactNode } from 'react'

const StaticLayout = ({
  children,
  isHome,
  withHeaderFooter,
}: {
  children: ReactNode
  isHome?: boolean
  withHeaderFooter: boolean
}) => {
  if (withHeaderFooter) {
    return (
      <div className="max-w-[800px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen gid">
        <AppHeader isHome={isHome} />
        <div className={isHome ? "" : "pt-4 pb-16 px-4"}>{children}</div>
        <AppFooter isHome={isHome} />
      </div>
    )
  } else {
    return (
      <div className="max-w-[800px] mx-auto grid grid-rows-1 h-screen">
        {children}
      </div>
    )
  }
}

export default StaticLayout
