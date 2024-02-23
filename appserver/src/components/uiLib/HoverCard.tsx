import { ReactNode } from 'react'

const HoverCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.25)] overflow-hidden">
      {children}
    </div>
  )
}

export default HoverCard
