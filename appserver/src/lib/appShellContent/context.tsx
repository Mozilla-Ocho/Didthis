/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useEffect, useRef } from 'react'
import { createInitialState, State, useAppShellState } from './state'
import { useRouter } from 'next/router'

export const AppShellContext = createContext<State>(createInitialState())

export type AppShellContextProps = {
  children: ReactNode
}

export default function AppShellContextProvider({
  children,
}: AppShellContextProps) {
  const [state, dispatch] = useAppShellState()
  const router = useRouter()

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
      .then(() => dispatch({ type: 'update', key: 'appReady', value: true }))
    return () => api.deinit()
  }, [inAppWebView, api, dispatch])

  // On start of route change, reset top nav bar so it doesn't stick around
  // for routes not using it.
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      api.request('webviewRouterEvent', { event: "routeChangeStart", url });
    };
    const handleRouteChangeComplete = (url: string) => {
      api.request('webviewRouterEvent', { event: "routeChangeComplete", url });
      api.request('updateTopNav', { show: false });
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      }
  }, [api, router])

  return (
    <AppShellContext.Provider value={state}>
      {children}
    </AppShellContext.Provider>
  )
}
