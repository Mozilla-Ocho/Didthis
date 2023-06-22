import { Button, Modal } from '@/components/uiLib'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import DefaultLayout from '@/components/DefaultLayout'
import { getServerSideProps as indexPageGetServerSideProps } from '@/pages/index'
import LoginBouncer from '@/components/auth/LoginBouncer'
import { useStore } from '@/lib/store'

const Scratch = observer(() => {
  const store = useStore()
  const [isOpen, setIsOpen] = useState(false)
  if (!store.user) return <LoginBouncer />
  const launchModal = () => setIsOpen(true)
  const hc = () => setIsOpen(false)
  return (
    <>
      <Modal id="scratch" isOpen={isOpen} title="foo" handleClose={hc}>
        hi
      </Modal>
      <Button onClick={launchModal}>open modal</Button>
    </>
  )
})

const Wrapper = ({
  authUser,
  signupCode,
}: {
  authUser: ApiUser | false
  signupCode: string | false
}) => {
  return (
    <DefaultLayout
      authUser={authUser}
      signupCode={signupCode}
    >
      <Scratch />
    </DefaultLayout>
  )
}

export default Wrapper

export const getServerSideProps = indexPageGetServerSideProps
