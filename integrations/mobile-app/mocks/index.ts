import { CapturedImage, ApiPost, ApiProject } from "../lib/types";
import { makeDidThisImage } from "./images";

export const mockImage: CapturedImage = makeDidThisImage();

export const mockPost: ApiPost = {
  id: "8675309",
  projectId: "23234242",
  createdAt: new Date("2023-09-08T13:13-07:00").getTime(),
  didThisAt: new Date("2023-09-02T10:23-07:00").getTime(),
  updatedAt: new Date("2023-09-08T13:13-07:00").getTime(),
  scope: "public",
  description: "this is a sample post",
  image: mockImage,
};

export const mockProject: ApiProject = {
  id: "project-8675309",
  createdAt: new Date("2023-09-08T13:13-07:00").getTime(),
  updatedAt: new Date("2023-09-08T13:13-07:00").getTime(),
  title: "Sample project",
  scope: "public",
  currentStatus: "active",
  posts: {
    [mockPost.id]: mockPost,
    "1234": {
      ...mockPost,
      id: "1234",
      didThisAt: new Date("2023-09-03T10:23-07:00").getTime(),
      description: "another sample post",
    },
    "5678": {
      ...mockPost,
      id: "5678",
      didThisAt: new Date("2023-09-01T10:23-07:00").getTime(),
      description: "one more sample post",
    },
  },
};
