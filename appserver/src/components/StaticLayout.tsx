import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import type { ReactNode } from 'react'

// TODO: isThe404 should be called 'isStatic' and StaticLayout component is
// misleadingly named as it's used for all pages really.

const StaticLayout = ({
  children,
  unauthHomepage,
  isThe404,
  hideLogin,
}: {
  children: ReactNode
  unauthHomepage?: boolean
  isThe404?: boolean
  hideLogin?: boolean
}) => {
  if (unauthHomepage) return <div>{children}</div>
  return (
    <div className="max-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <AppHeader isThe404={isThe404} hideLogin={hideLogin} />
      <div>{children}</div>
      <AppFooter />
    </div>
  )
}

export default StaticLayout
