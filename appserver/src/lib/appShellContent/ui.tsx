import { AppRequestMethods } from './types'
import { useAppShellListener } from './messaging'
import useAppShell from './index'
import { useEffect } from 'react'

export function useAppShellTopBar(
  state: AppRequestMethods['updateTopNav']['request'],
  extraDependencies?: unknown[],
  onLeftPress?: () => void,
  onRightPress?: () => void
) {
  const appShell = useAppShell()
  useAppShellListener('topNavLeftPress', onLeftPress)
  useAppShellListener('topNavRightPress', onRightPress)
  useEffect(() => {
    appShell.api.request('updateTopNav', state)
  }, [state, appShell.api, extraDependencies])
}
