import { Post } from "./Post";
import { ApiPost } from "../store/types";
import { mockPost } from "../mocks";

export default {
  title: "components/Post",
  component: Post,
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
