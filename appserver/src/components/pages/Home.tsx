import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import HomeAuth from './HomeAuth'
import HomeUnauth from './HomeUnauth'

const Home = observer(() => {
  const store = useStore()
  return store.user ? <HomeAuth /> : <HomeUnauth />
})

export default Home
