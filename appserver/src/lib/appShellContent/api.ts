/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MessageHandler } from "./messaging"
import { AppRequestMethods } from "./types"

export class AppShellAPI {
  messaging: MessageHandler

  constructor() {
    this.messaging = new MessageHandler()
  }

  isInWebView() {
    return !!this.messaging.getWebView()
  }

  init() {
    this.messaging.listen()
  }

  deinit() {
    this.messaging.unlisten()
  }

  async request<T extends keyof AppRequestMethods>(
    method: T,
    payload: AppRequestMethods[T]['request']
  ) {
    return this.messaging.request(method, payload);
  }
}

export default AppShellAPI
