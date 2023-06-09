import type { ReactNode } from 'react'

// XXX_SKELETON
const StaticLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div id="outer" className="p-10">
      {children}
    </div>
  )
}

export default StaticLayout
