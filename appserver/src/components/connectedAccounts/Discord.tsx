import { useEffect, useState } from 'react'
import { Button, ConfirmationModal, Link } from '../uiLib'
import { useStore } from '@/lib/store'
import branding from '@/lib/branding'
import { FormStore } from '../forms/User'

const csrfCookieName = '_h3y_csrf' // DRY_86325 crsf cookie name. TODO: put this in a non-typescript shared const file?
const DISCORD_BASE_AUTHORIZE_URL = 'https://discord.com/oauth2/authorize'
const DISCORD_REDIRECT_PATH = '/connect/discord'

export type DiscordAccountProps = {
  user: ApiUser
  shareByDefault: boolean
  setShareByDefault: (state: boolean) => void
}

export default function DiscordAccount({
  user,
  shareByDefault,
  setShareByDefault,
}: DiscordAccountProps) {
  const store = useStore()

  const [modalOpen, setModalOpen] = useState(false)

  // HACK: clientLoaded will be true only on client-side, avoiding a hydration error
  const [clientLoaded, setClientLoaded] = useState(false)
  useEffect(() => setClientLoaded(true), [])

  const handleDisconnect = () => setModalOpen(true)
  const handleCancelDisconnect = () => setModalOpen(false)
  const handleConfirmDisconnect = () => store.disconnectDiscord()
  const handleChangeShareByDefault = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShareByDefault(e.target.checked)
  }

  const connectedAccounts = user.profile.connectedAccounts
  if (connectedAccounts?.discord) {
    const { discord } = connectedAccounts
    const userLink = `https://discord.com/users/${discord.id}`
    return (
      <>
        <p className="text-sm text-form-labels">
          <Button
            className="mr-3 mb-3"
            intent="secondary"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
          Connected as:{' '}
          <Link external={true} href={userLink}>
            {discord.globalName}
          </Link>
        </p>

        <label
          htmlFor="visibility"
          className="inline-flex flex-row items-center cursor-pointer"
        >
          <span className="mr-3 text-sm text-form-labels inline-block cursor-pointer">
            Automatically share project updates by default:
          </span>
          <span className="relative inline-flex items-center inline-block">
            <input
              type="checkbox"
              id="visibility"
              value="private"
              className="sr-only peer"
              checked={shareByDefault}
              onChange={handleChangeShareByDefault}
            />
            {/* https://flowbite.com/docs/forms/toggle/ */}
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-form-toggle-bg peer-disabled:opacity-75"></div>
          </span>
        </label>

        <ConfirmationModal
          isOpen={modalOpen}
          title={'Disconnect your Discord account?'}
          yesText="Yes"
          noText="No"
          onYes={handleConfirmDisconnect}
          onNo={handleCancelDisconnect}
          onClose={handleCancelDisconnect}
        >
          <p className="mt-6 mb-6">
            Your updates will no longer be shared in Discord. Are you sure you
            want to disconnect your account?
          </p>
        </ConfirmationModal>
      </>
    )
  }

  // HACK: since everything from here on needs client-side resources, bail
  // until client loaded to avoid hydration errors
  if (!clientLoaded) {
    return <p>...</p>
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  if (!clientId) {
    return <p>Discord client not configured.</p>
  }

  // Grab the CSRF cookie to use as a nonce in OAuth flow
  // TODO: There's probably a cleaner way to grab this cookie.
  let csrfCookie
  try {
    csrfCookie = document.cookie
      .split(/; ?/)
      .map(v => v.split(/=/))
      .filter(([k, v]) => k === csrfCookieName)[0][1]
  } catch (error) {
    /* no-op*/
  }
  if (!csrfCookie) {
    return <p>Could not find CSRF cookie.</p>
  }

  // Get an absolute URL to the appropriate OAuth redirect_uri
  const baseUrl = window.location.href
  const redirectUri = new URL(DISCORD_REDIRECT_PATH, baseUrl).toString()

  // see also: https://discord.com/developers/docs/topics/oauth2
  const authorizeParams = new URLSearchParams([
    ['client_id', clientId],
    ['state', csrfCookie],
    ['redirect_uri', redirectUri],
    ['response_type', 'code'],
    ['scope', 'identify email'],
  ])
  const authorizeUrl = new URL(
    `${DISCORD_BASE_AUTHORIZE_URL}?${authorizeParams.toString()}`
  )

  return (
    <p className="text-base">
      <Link intent="primary" href={authorizeUrl.toString()}>
        Connect to Discord
      </Link>
    </p>
  )
}
