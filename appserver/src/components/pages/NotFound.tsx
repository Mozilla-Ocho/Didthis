import { H } from '@/components/uiLib'
import { ReactNode } from 'react'

const NotFound = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="pt-8 text-center">
      <H.H5>Page not found</H.H5>
      {children}
    </div>
  )
}

export default NotFound
