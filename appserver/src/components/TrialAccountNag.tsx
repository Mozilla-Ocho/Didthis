import { ClaimTrialAccountButton } from '@/components/auth/ClaimTrialAccountButton'
import branding from '@/lib/branding'

const TrialAccountNag = ({ user }: { user: ApiUser }) => {
  const projects = user.profile.projects
  if (Object.keys(projects).length == 0) {
    return <></>
  }
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 bg-trialaccountnag">
      <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
        <div className="text-sm">
          To save your work, share it publicly, and to sign in from other devices, create a {branding.productName} account.
        </div>
        <div>
          <div className="text-sm text-end whitespace-nowrap">
            <ClaimTrialAccountButton intent="link" skipConfirmation={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrialAccountNag
