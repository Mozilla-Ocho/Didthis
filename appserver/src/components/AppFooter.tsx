import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { Divider, Link } from './uiLib'
import classNames from 'classnames'
import pathBuilder from '@/lib/pathBuidler'

const AppFooter = observer(({ isHome }: { isHome?: boolean }) => {
  const store = useStore()
  const isHomeUnauth = !store.user && isHome
  return (
    <div>
      <Divider className="my-0" />
      <div
        className={classNames(
          'p-4',
          isHomeUnauth ? 'bg-yellow-home' : 'bg-white',
          'leading-10',
          'h-full'
        )}
      >
        <p>
          <Link href={pathBuilder.legal('tos')}>Terms of service</Link>
        </p>
        <p>
          <Link href={pathBuilder.legal('pp')}>Privacy policy</Link>
        </p>
        <p>
          <Link href={pathBuilder.legal('au')}>Acceptable use</Link>
        </p>
        <p>A Mozilla Ocho Idea</p>
      </div>
    </div>
  )
})

export default AppFooter
