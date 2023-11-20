import { useEffect, useRef } from 'react'
import {
  AppMessages,
  AppRequestMethods,
  MessageRequest,
  MessageResponse,
  MessageResponses,
  Failure,
  AppRequestMethodNames,
} from './types'

const MESSAGE_EVENT = 'AppShellMessage'

type EventWithData = Event & { data: string }

type WebViewWindow = typeof window & {
  ReactNativeWebView: {
    postMessage(message: string): void
  }
}

type PendingMessageRequest<T extends AppRequestMethodNames> =
  MessageRequest<T> & {
    resolve: (
      value:
        | AppRequestMethods[T]['response']
        | PromiseLike<AppRequestMethods[T]['response']>
    ) => void
    reject: (error: Failure) => void
  }

export class MessageHandler {
  pendingRequests: Record<
    string,
    PendingMessageRequest<keyof AppRequestMethods>
  >
  listener?: (event: Event) => void
  lastId: number

  constructor() {
    this.pendingRequests = {}
    this.listener = undefined
    this.lastId = 0
  }

  generateRequestId() {
    this.lastId++
    return `request-${this.lastId}`
  }

  getWebView() {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    if (
      typeof window !== 'undefined' &&
      // @ts-ignore: non-standard property injected into window
      typeof window.ReactNativeWebView !== 'undefined' &&
      // @ts-ignore: non-standard property injected into window
      typeof window.ReactNativeWebView.postMessage !== 'undefined'
    ) {
      return (window as WebViewWindow).ReactNativeWebView
    }
    /* eslint-enable @typescript-eslint/ban-ts-comment */
  }

  async request<T extends keyof AppRequestMethods>(
    method: T,
    payload?: AppRequestMethods[T]['request']
  ): Promise<AppRequestMethods[T]['response']> {
    const request: MessageRequest<T> = {
      type: 'request',
      id: this.generateRequestId(),
      method,
      payload,
    }
    return new Promise<MessageResponse<T>['payload']>((resolve, reject) => {
      const webview = this.getWebView()
      if (!webview) return reject(new Error('not in app shell'))

      this.pendingRequests[request.id] = { ...request, resolve, reject }
      webview.postMessage(JSON.stringify(request))
    })
  }

  listen() {
    if (this.listener) this.unlisten()
    this.listener = this.handleMessage.bind(this)
    // HACK: document works on iOS, window on Android
    window.addEventListener('message', this.listener)
    document.addEventListener('message', this.listener)
  }

  unlisten() {
    if (!this.listener) return
    // HACK: document works on iOS, window on Android
    window.removeEventListener('message', this.listener)
    document.removeEventListener('message', this.listener)
  }

  handleMessage(event: Event) {
    try {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore: need to find a better predefined type for MessageEvent that includes data
      if (typeof event.data === 'undefined') return
      /* eslint-enable @typescript-eslint/ban-ts-comment */

      const dataEvent = event as EventWithData
      const { type, id, payload } = JSON.parse(dataEvent.data)

      document.dispatchEvent(
        new CustomEvent(MESSAGE_EVENT, {
          detail: { type, id, payload },
        })
      )

      if (type === 'response') {
        const pending = this.pendingRequests[id]
        if (pending && typeof payload === 'object') {
          delete this.pendingRequests[id]
          if ('failure' in payload) {
            pending.reject(payload as Failure)
          } else {
            pending.resolve(payload as MessageResponses['payload'])
          }
        }
      }
    } catch (e) {
      console.error('Failed to handle message', e)
    }
  }
}

/**
 * Hook to register listener for a message type from app shell
 *
 * @param expectedType name of the message type expected from app
 * @param handler handler function to accept payload and ID
 */
export function useAppShellListener<T extends keyof AppMessages>(
  expectedType: T,
  handler?: (payload: AppMessages[T], id: string) => void
) {
  const listener = useRef<(evt: Event) => void>()
  useEffect(() => {
    if (!handler) return
    if (typeof document !== 'undefined') {
      listener.current = ev => {
        const { detail } = ev as CustomEvent
        const { type, payload, id } = detail
        if (expectedType === type) {
          handler(payload, id)
        }
      }
      document.addEventListener(MESSAGE_EVENT, listener.current)
    }
    return () => {
      if (listener.current) {
        document.removeEventListener(MESSAGE_EVENT, listener.current)
      }
    }
  }, [expectedType, handler, listener])
}
