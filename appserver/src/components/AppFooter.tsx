import {observer} from "mobx-react-lite"
import { useStore } from "@/lib/store";

// XXX_SKELETON
const AppFooter = observer(() => {
  const store = useStore()
  return (
    <div>
      <hr/>
      app footer. 
      <hr/>
    </div>
  );
})

export default AppFooter
