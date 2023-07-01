import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import type { ReactNode } from 'react'

const StaticLayout = ({
  children,
  unauthHomepage,
  isThe404,
}: {
  children: ReactNode
  unauthHomepage?: boolean
  isThe404?: boolean
}) => {
  if (unauthHomepage) return <div>{children}</div>
  return (
    <div className="max-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <AppHeader isThe404={isThe404} />
      <div>{children}</div>
      <AppFooter />
    </div>
  )
}

export default StaticLayout
