import Head from 'next/head'
import branding from '@/lib/branding'

const PageTitle = ({ title }: { title?: string | undefined }) => (
  <Head>
    <title>{branding.pageTitle(title)}</title>
  </Head>
)

export default PageTitle
