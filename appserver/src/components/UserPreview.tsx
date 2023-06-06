import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";

// XXX_SKELETON
const UserPreview = observer(({user}:{user: ApiUser}) => {
  const store = useStore()
  const isSelf = store.user && store.user.id === user.id
  return <div>
    <hr />
    user preview... and avatar goes here and such
    {isSelf && '(clickable edit link here)'}
    <hr />
  </div>
})

export default UserPreview
