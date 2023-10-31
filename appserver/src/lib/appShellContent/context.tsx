/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useEffect, useRef } from 'react'
import { createInitialState, State, useAppShellState } from './state'

export const AppShellContext = createContext<State>(createInitialState())

export type AppShellContextProps = {
  children: ReactNode
}

export default function AppShellContextProvider({
  children,
}: AppShellContextProps) {
  const [state, dispatch] = useAppShellState()
  const { inAppWebView, api } = state
  const isInWebView = api.isInWebView()

  // First, make note of whether we're hosted in an app shell webview
  useEffect(() => {
    dispatch({ type: 'update', key: 'inAppWebView', value: !!isInWebView })
  }, [isInWebView, dispatch])

  // Second, if we think we're in a webview, attempt to contact the app shell
  useEffect(() => {
    if (!inAppWebView) return
    api.init()
    api
      .request('ping', undefined)
      .then(() =>
        dispatch({ type: 'update', key: 'inAppWebView', value: true })
      )
    return () => api.deinit()
  }, [inAppWebView, api, dispatch])

  return (
    <AppShellContext.Provider value={state}>
      {children}
    </AppShellContext.Provider>
  )
}
