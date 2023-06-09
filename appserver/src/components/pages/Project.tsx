// import { useStore } from "@/lib/store";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { H,Link,Timestamp } from "../uiLib";
import UserPreview from "../UserPreview";
import pathBuilder from "@/lib/pathBuidler";
import {getParamString} from "@/lib/nextUtils";
import NotFound from "./NotFound";

const ProjectPage = observer(({targetUser}:{targetUser:ApiUser}) => {
  // const store = useStore();
  if (!targetUser) return <NotFound>user not found</NotFound>;
  const router = useRouter();
  const projectId = getParamString(router,'projectId')
  const project = targetUser.profile.projects[projectId];
  console.log(projectId, targetUser.profile)
  if (!project) return <NotFound>project not found</NotFound>;
  return (
    <>
      <div>
        <UserPreview user={targetUser} />
        <H.H3>
            {project.title}
        </H.H3>
        <p>{project.currentStatus}</p>
        <p>{Object.keys(project.posts).length} posts</p>
        <p><Timestamp seconds={project.createdAt}/></p>
      </div>
    </>
  );
});

export default ProjectPage;
