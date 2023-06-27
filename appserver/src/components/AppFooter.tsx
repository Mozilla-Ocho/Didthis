import { observer } from 'mobx-react-lite'
import { Divider, Link, PagePad } from './uiLib'
import classNames from 'classnames'
import pathBuilder from '@/lib/pathBuilder'

const AppFooter = observer(
  ({ unauthHomepage }: { unauthHomepage?: boolean }) => {
    return (
      <div className={unauthHomepage ? 'bg-yellow-home' : 'bg-white'}>
        <Divider className="my-0" />
        <PagePad wide={true} noPadY>
          <div className={classNames('py-4', 'leading-10', 'h-full')}>
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
        </PagePad>
      </div>
    )
  }
)

export default AppFooter
