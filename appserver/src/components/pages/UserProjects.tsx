import { observer } from "mobx-react-lite";
import { H } from "@/components/uiLib";
import ProjectCard from "../ProjectCard";
import NotFound from "./NotFound";

// XXX_SKELETON
// - user preview
// - welcome mode
// - project list
// - add proj btn
// - sort?
const UserProjects = observer(({targetUser}:{targetUser:ApiUser | false}) => {
  if (!targetUser) return <NotFound />;
  const projects = Object.values(targetUser.profile.projects)
  if (projects.length === 0) return <></>
  projects.sort((a,b) => a.createdAt - b.createdAt)
  return (
    <>
      <div>
        <H.H1>projects for user {targetUser.urlSlug || targetUser.id}</H.H1>
        {projects.map(p => <ProjectCard key={p.id} project={p} targetUser={targetUser}/>)}
      </div>
    </>
  );
});

export default UserProjects
