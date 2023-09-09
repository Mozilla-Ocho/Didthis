import { Project } from "./Project";
import { ApiProject } from "../store/types";
import { mockProject } from "../mocks";

export default {
  title: "components/Project",
  component: Project,
  argTypes: {

  }
}

export const Default = {
  args: {
    project: {
      ...mockProject
    }
  }
}
