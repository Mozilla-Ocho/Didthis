import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";

import { H } from "@/components/uiLib";

// XXX_SKELETON

const PostForm = observer(() => {
  const store = useStore();
  return (
    <div>
      <H.H2>post form here...</H.H2>
    </div>
  );
});

export default PostForm;
