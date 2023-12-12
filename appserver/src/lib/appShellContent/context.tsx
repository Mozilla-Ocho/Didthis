/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useEffect, useRef } from 'react'
import { createInitialState, State, useAppShellState } from './state'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useAppShellListener } from './messaging'
import { useStore } from '../store'
import pathBuilder from '../pathBuilder'

const { publicRuntimeConfig } = getConfig()
const SERVER_VERSION = publicRuntimeConfig?.version
const SERVER_BUILD = publicRuntimeConfig?.build
const SERVER_TAG = publicRuntimeConfig?.tag

export const AppShellContext = createContext<State>(createInitialState())

export type AppShellContextProps = {
  children: ReactNode
}

export default function AppShellContextProvider({
  children,
}: AppShellContextProps) {
  const [state, dispatch] = useAppShellState()
  const router = useRouter()
  const store = useStore()

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
      .request('ping', {
        version: SERVER_VERSION,
        build: SERVER_BUILD,
        tag: SERVER_TAG,
      })
      .then((appVersionInfo = {}) => {
        dispatch({
          type: 'update',
          key: 'appVersionInfo',
          value: appVersionInfo,
        })
        dispatch({ type: 'update', key: 'appReady', value: true })
      })
    return () => api.deinit()
  }, [inAppWebView, api, dispatch])

  // On start of route change, reset top nav bar so it doesn't stick around
  // for routes not using it.
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      api.request('webviewRouterEvent', { event: 'routeChangeStart', url })
    }
    const handleRouteChangeComplete = (url: string) => {
      api.request('webviewRouterEvent', { event: 'routeChangeComplete', url })
      api.request('updateTopNav', { show: false })
    }
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    // register a user listener. note this callback will be called right away
    // if the user exists. note also the user updates any time profile data
    // updates from the webview, e.g. new posts, projects, edits, etc.
    const deregUserListen = store.registerUserListener((theUser: ApiUser) => {
      if (theUser) {
        api.request('updateAppConfig', {
          user: theUser,
          links: {
            user: pathBuilder.user(theUser.systemSlug),
            userEdit: pathBuilder.userEdit(theUser.systemSlug),
            newPost: pathBuilder.newPost(theUser.systemSlug),
          },
        })
      }
    })
    return () => {
      deregUserListen()
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [api, router, store, state.appReady])

  useAppShellListener('navigateToPath', ({ path }) => router.push(path))

  return (
    <AppShellContext.Provider value={state}>
      {children}
    </AppShellContext.Provider>
  )
}
