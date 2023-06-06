import { observer } from "mobx-react-lite";

import { H } from "@/components/uiLib";
import NotFound from "./NotFound";

// XXX_SKELETON
// - user preview
// - welcome mode
// - project list
// - add proj btn
// - sort?
const UserProjects = observer(({targetUser}:{targetUser:ApiUser | false}) => {
  if (!targetUser) return <NotFound />
  return (
    <>
      <div>
        <H.H1>projects for user {targetUser.urlSlug || targetUser.id}</H.H1>
      </div>
    </>
  );
});

export default UserProjects
