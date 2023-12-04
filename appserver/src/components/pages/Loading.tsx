import { Spinner } from '@/components/uiLib'

const Loading = () => {
  return (
    <div className="w-screen h-screen grid items-center justify-center">
      <Spinner className="w-16 h-16 opacity-50" />
    </div>
  )
}

export default Loading
