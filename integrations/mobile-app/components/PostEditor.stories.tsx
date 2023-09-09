import { PostEditor } from "./PostEditor";
import { ApiPost } from "../store/types";
import { mockPost } from "../mocks";

export default {
  title: "components/PostEditor",
  component: PostEditor,
  argTypes: {

  }
}

export const Default = {
  args: {
    post: {
      ...mockPost
    }
  }
}
