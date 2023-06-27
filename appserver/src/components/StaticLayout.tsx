import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import type { ReactNode } from 'react'
import { PagePad } from './uiLib'

const StaticLayout = ({
  children,
  wide,
  unauthHomepage,
}: {
  children: ReactNode
  wide?: boolean
  unauthHomepage?: boolean
}) => {
  if (unauthHomepage) return <div>{children}</div>
  return (
    <div className="max-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <AppHeader />
      <PagePad wide={wide} className={'pt-4 pb-16'}>
        {children}
      </PagePad>
      <AppFooter />
    </div>
  )
}

export default StaticLayout
