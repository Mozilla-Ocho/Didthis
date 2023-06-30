import { observer } from 'mobx-react-lite'
import { Divider, Link, PagePad } from './uiLib'
import classNames from 'classnames'
import pathBuilder from '@/lib/pathBuilder'

const AppFooter = observer(
  ({ unauthHomepage }: { unauthHomepage?: boolean }) => {
    return (
      <div className="bg-white">
        <Divider className="my-0" />
        <PagePad wide={true} noPadY>
          <div className="flex flex-col md:flex-row gap-2 md:gap-8 p-6 md:justify-center text-sm">
            <p>
              <Link intent="internalNav" href={pathBuilder.legal('tos')}>
                Terms of service
              </Link>
            </p>
            <p>
              <Link intent="internalNav" href={pathBuilder.legal('pp')}>
                Privacy notice
              </Link>
            </p>
            <p>
              <Link intent="internalNav" href={pathBuilder.legal('cp')}>
                Content policies
              </Link>
            </p>
            <p className="hidden md:block">&bull;</p>
            <p>A Mozilla Ocho Idea</p>
          </div>
        </PagePad>
      </div>
    )
  }
)

export default AppFooter
