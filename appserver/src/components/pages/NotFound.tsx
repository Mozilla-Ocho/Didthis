import { H, PagePad } from '@/components/uiLib'
import { ReactNode } from 'react'

const NotFound = ({ children }: { children?: ReactNode }) => {
  return (
    <PagePad wide>
      <div className="pt-10 text-center">
        <H.H5 className="m-4">There’s nothing here!</H.H5>
        {children ? (
          children
        ) : (
          <p className="text-form-labels text-sm">Page not found</p>
        )}
      </div>
    </PagePad>
  )
}

export default NotFound
