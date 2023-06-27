import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import type { ReactNode } from 'react'

const StaticLayout = ({
  children,
  unauthHomepage,
}: {
  children: ReactNode
  unauthHomepage?: boolean
}) => {
  if (unauthHomepage) return <div>{children}</div>
  return (
    <div className="max-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <AppHeader />
      <div>{children}</div>
      <AppFooter />
    </div>
  )
}

export default StaticLayout
