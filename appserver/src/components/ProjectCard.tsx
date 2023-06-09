import pathBuilder from "@/lib/pathBuidler";
import { observer } from "mobx-react-lite";
import { H, Link, Timestamp } from "./uiLib";

const ProjectCard = observer(
  ({ project, targetUser }: { project: ApiProject; targetUser: ApiUser }) => {
    return (
      <div className="border p-4">
        <H.H3>
          <Link href={pathBuilder.project(targetUser.urlSlug, project.id)}>
            {project.title}
          </Link>
        </H.H3>
        <p>{project.currentStatus}</p>
        <p>{Object.keys(project.posts).length} posts</p>
        <p><Timestamp seconds={project.createdAt}/></p>
      </div>
    );
  }
);

export default ProjectCard;
