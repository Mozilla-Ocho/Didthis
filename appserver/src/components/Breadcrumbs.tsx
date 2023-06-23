import pathBuilder from '@/lib/pathBuilder'
import { useStore } from '@/lib/store'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from './uiLib'

type Crumb = {
  name: string
  href?: string
}

const Breadcrumbs = observer(({ crumbs }: { crumbs: Crumb[] }) => {
  const store = useStore()
  if (crumbs.length) {
    const numCrumbs = crumbs.length + 1 // plus one for home
    const numCols = numCrumbs * 2 - 1 // each arrow is a column in between each crumb column
    let gridCols = 'grid-cols-[auto]'
    // tailwind needs literal strings
    if (numCols === 2) gridCols = 'grid-cols-[auto_auto]'
    if (numCols === 3) gridCols = 'grid-cols-[auto_auto_auto]'
    if (numCols === 4) gridCols = 'grid-cols-[auto_auto_auto_auto]'
    if (numCols === 5) gridCols = 'grid-cols-[auto_auto_auto_auto_auto]'
    if (numCols === 6) gridCols = 'grid-cols-[auto_auto_auto_auto_auto_auto]'
    if (numCols === 7)
      gridCols = 'grid-cols-[auto_auto_auto_auto_auto_auto_auto]'
    if (numCols === 8)
      gridCols = 'grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto]'
    // more than 9 (5 crumbs) not supported
    if (numCols > 9)
      gridCols = 'grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto]'
    return (
      <div className={`p-4 -mt-4 -mx-4 mb-4 bg-breadcrumbs`}>
        <div className={`w-fit grid gap-2 ${gridCols}`}>
          <div>
            <Link
              intent="internalNav"
              href={
                store.user ? pathBuilder.user(store.user.publicPageSlug) : '/'
              }
            >
              Home
            </Link>
          </div>
          <div> &gt; </div>
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <div className="truncate">
                {crumb.href ? (
                  <Link intent="internalNav" href={crumb.href}>
                    {crumb.name}
                  </Link>
                ) : (
                  <span>{crumb.name}</span>
                )}
              </div>
              {idx < crumbs.length - 1 && <div> &gt; </div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }
  return <></>
})

export default Breadcrumbs
