import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import UserProjects from "./UserProjects";
import Modal from "../Modal";
import { useState } from "react";
import { Button,Link } from "@/components/uiLib";

const HomeAuth = observer(() => {
  const store = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const launchModal = () => setIsOpen(true);
  const hc = () => setIsOpen(false);
  if (!store.user) return; // typescript helper, it doesn't know this component is auth only
  return (
    <>
      <Modal isOpen={isOpen} title="foo" handleClose={hc}>
        hi
      </Modal>
      <Button onClick={launchModal}>open modal</Button>
      {Object.keys(store.user.profile.projects).length ? (
        <UserProjects targetUser={store.user} />
      ) : (
        <div>
          <Link intent="primary" href={"/user/"+store.user.urlSlug+"/post"}>post</Link>
        </div>
      )}
    </>
  );
});

export default HomeAuth;
