import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import type { ReactNode } from 'react'

const StaticLayout = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <div className="max-w-[800px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <AppHeader />
      <div className="pt-4 pb-16 px-4">{children}</div>
      <AppFooter isHomeUnauth={false} />
    </div>
  )
}

export default StaticLayout
