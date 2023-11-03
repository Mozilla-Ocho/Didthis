import { AppRequestMethods } from './types'
import { useAppShellListener } from './messaging'
import useAppShell from './index'
import { useEffect } from 'react'

/* eslint-disable @typescript-eslint/no-empty-function */
const noop = () => {}

export function useAppShellTopBar(
  params: AppRequestMethods['updateTopNav']['request'] & {
    onLeftPress?: () => void
    onRightPress?: () => void
    onSharePress?: () => void
    onEditPress?: () => void
  }
) {
  const {
    onLeftPress = noop,
    onRightPress = noop,
    onSharePress = noop,
    onEditPress = noop,
    ...state
  } = params
  const appShell = useAppShell()
  useAppShellListener('topNavLeftPress', onLeftPress)
  useAppShellListener('topNavRightPress', onRightPress)
  useAppShellListener('topNavSharePress', onSharePress)
  useAppShellListener('topNavEditPress', onEditPress)
  useEffect(() => {
    appShell.api.request('updateTopNav', state)
  }, [state, appShell.api])
}
