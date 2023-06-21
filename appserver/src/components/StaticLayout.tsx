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
      <div className="max-w-[800px] mx-auto grid grid-rows-[auto_auto_1fr] h-screen gid">
        <AppHeader isHome={isHome} />
        <div>{children}</div>
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
