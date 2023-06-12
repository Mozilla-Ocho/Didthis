import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { Divider } from './uiLib'

// XXX_SKELETON
const AppFooter = observer(() => {
  const store = useStore()
  return (
    <>
      <Divider className="my-0" />
      <div className="bg-slate-100 p-4 text-center text-slate-500">app footer.</div>
    </>
  )
})

export default AppFooter
