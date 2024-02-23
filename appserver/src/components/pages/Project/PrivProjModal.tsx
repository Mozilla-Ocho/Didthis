import { Link, ConfirmationModal } from '@/components/uiLib'
import pathBuilder from '@/lib/pathBuilder'

const PrivProjModal = ({
  isOpen,
  handleClose,
  targetUser,
  project,
}: {
  isOpen: boolean
  handleClose: VoidFunction
  targetUser: ApiUser
  project: ApiProject
}) => (
  <ConfirmationModal
    isOpen={isOpen}
    title="This project is private"
    yesText="OK"
    onYes={handleClose}
    onClose={handleClose}
  >
    This project is currently set private. To get a shareable link, edit the
    project and set it to public.
    <Link
      intent="secondary"
      className="my-4 w-full"
      href={pathBuilder.projectEdit(targetUser.publicPageSlug, project.id)}
    >
      Edit project
    </Link>
  </ConfirmationModal>
)

export default PrivProjModal
