import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";

import { H } from "@/components/uiLib";

// XXX_SKELETON

const ProjectForm = observer(() => {
  const store = useStore();
  return (
    <div>
      <H.H2>project form here...</H.H2>
    </div>
  );
});

export default ProjectForm;
