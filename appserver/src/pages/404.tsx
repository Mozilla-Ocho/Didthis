import DefaultLayout from '@/components/DefaultLayout'
import NotFound from '@/components/pages/NotFound'

// note: nextjs doesn't support getServerSideProps in the 404 page. so we can't
// do an authenticated layout mode.

const The404 = ({}) => {
  return (
    <DefaultLayout
      isThe404
      authUser={false}
      signupCodeInfo={false}
    >
      <NotFound />
    </DefaultLayout>
  )
}

export default The404
