import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import type { ReactNode } from 'react'

const StaticLayout = ({
  children,
  withHeaderFooter,
}: {
  children: ReactNode
  withHeaderFooter: boolean
}) => {
  return (
    <div className="max-w-[800px] mx-auto">
      {withHeaderFooter && <AppHeader />}
      <div className="py-8">
      {children}
      </div>
      {withHeaderFooter && <AppFooter />}
    </div>
  )
}

export default StaticLayout
