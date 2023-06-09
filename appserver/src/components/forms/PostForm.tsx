import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Button, Select, Textarea } from "../uiLib";
import { useRouter } from "next/router";

// XXX_SKELETON

const ProjectSelector = ({
  projectId,
  setProjectId,
}: {
  projectId: string;
  setProjectId: (arg0: string) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectId(e.target.value);
  };
  const store = useStore();
  if (!store.user) return <></>;
  const nameAndId = [["new project", "new"]];
  store.user.profile.projects.forEach((proj) => {
    nameAndId.push([proj.title, proj.id]);
  });
  return (
    <div>
      <p>Project:</p>
      <Select onChange={handleChange}
        value={projectId}
      >
        {nameAndId.map((nid) => (
          <option key={nid[1]} value={nid[1]} selected={nid[1] === projectId}>
            {nid[0]}
          </option>
        ))}
      </Select>
    </div>
  );
};

const PostForm = observer(() => {
  // const store = useStore();
  const router = useRouter();
  const defaultPid = router.query.projectId + "" || "new";
  const [projectId, setProjectId] = useState<string>(defaultPid);
  const [post, setPost] = useState<ApiPost>({
    id: "new",
    title: "",
    scope: "public",
  });
  const handleSubmit = () => {
    //
  };
  const setBlurb = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    const upd = { ...post, description: e.target.value };
    setPost(upd);
  };
  // XXX validation
  const hasContent = (post.description || "").trim().length > 0;
  return (
    <div>
      <form onSubmit={handleSubmit} method="POST">
        <label>post content:</label>
        <ProjectSelector projectId={projectId} setProjectId={setProjectId} />
        <Textarea
          placeholder="Write your update here..."
          name="blurb"
          value={post.description || ""}
          onChange={setBlurb}
        />
        <Button type="submit" disabled={!hasContent}>
          POST
        </Button>
      </form>
    </div>
  );
});

export default PostForm;
