import { ClaimTrialAccountButton } from '@/components/auth/ClaimTrialAccountButton'
import branding from '@/lib/branding'

const TrialAccountNag = ({ user }: { user: ApiUser }) => {
  const projects = user.profile.projects
  if (Object.keys(projects).length == 0) {
    return <></>
  }
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 bg-trialaccountnag">
      <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
        <div className="text-sm">
          You’ve signed in with a temporary {branding.productName} trial
          account—claim now so you can sign back in later.
        </div>
        <div>
          <div className="text-sm text-end">
            <ClaimTrialAccountButton intent="link" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrialAccountNag
