import DefaultLayout from '@/components/DefaultLayout'
import NotFound from '@/components/pages/NotFound'

const The404 = ({}) => {
  return (
    <DefaultLayout
      authUser={false}
      signupCode={''}
    >
      <NotFound />
    </DefaultLayout>
  )
}

export default The404
