import { observer } from "mobx-react-lite";
import { useStore } from "@/lib/store";
import UserProjects from "./UserProjects";
import Modal from "../Modal";
import { useState } from "react";
import { Button } from "@/components/uiLib";

const HomeAuth = observer(() => {
  const store = useStore();
  const [isOpen,setIsOpen] = useState(false)
  const launchModal = () => setIsOpen(true)
  const hc = () => setIsOpen(false)
  return (
    <>
      <Modal isOpen={isOpen} title="foo" handleClose={hc}>
        hi
      </Modal>
      <Button onClick={launchModal}>open modal</Button>
      <UserProjects targetUser={store.user} />
    </>
  );
});

export default HomeAuth;
