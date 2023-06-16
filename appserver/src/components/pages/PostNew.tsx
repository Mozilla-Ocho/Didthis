import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'

import { H } from '@/components/uiLib'
import LoginBouncer from '@/components/auth/LoginBouncer'
import PostForm from '@/components/forms/PostForm'

const NewPostPage = observer(() => {
  const store = useStore()
  if (!store.user) {
    return <LoginBouncer />
  }
  // note the PostForm component will look at the router path and get the
  // project id if any.
  return (
    <>
      <div>
        <H.H1>new post</H.H1>
        <PostForm mode="new" />
      </div>
    </>
  )
})

export default NewPostPage
