import WebView, { WebViewMessageEvent } from "react-native-webview";

export type Payload = { [key: string]: string | Payload };

export type MessageRequest = {
  type: "request";
  id: string;
  method: string;
  payload: Payload;
};

export type MessageResponse = {
  type: "response";
  id: string;
  payload: Payload;
};

export type MessageRequestHandler = (
  payload: MessageRequest["payload"],
  id: MessageRequest["id"]
) => MessageResponse["payload"] | PromiseLike<MessageResponse["payload"]>;

export type DeferredResponse = {
  resolve: (payload: MessageResponse["payload"]) => void;
  reject: (error: any) => void;
};

export default class MessageHandler {
  webview: WebView | undefined;
  deferredResponses: Record<MessageResponse["id"], DeferredResponse>;
  requestHandlers: Record<MessageRequest["method"], MessageRequestHandler>;

  constructor() {
    this.webview = undefined;
    this.deferredResponses = {};
    this.requestHandlers = {
      ping: () => ({ message: "pong" }),
    };
  }

  get onMessage() {
    return this.handleMessage.bind(this);
  }

  setWebView(webview: WebView) {
    this.webview = webview;
  }

  registerMethod(method: string, handler: MessageRequestHandler) {
    this.requestHandlers[method] = handler;
  }

  async deferResponse(id: MessageResponse["id"]) {
    return new Promise<MessageResponse["payload"]>((resolve, reject) => {
      this.deferredResponses[id] = { resolve, reject };
    }).then((result) => {
      delete this.deferredResponses[id];
      return result;
    });
    // TODO: catch?
  }

  getDeferredResponse(id: MessageResponse["id"]) {
    return this.deferredResponses[id];
  }

  async handleMessage(event: WebViewMessageEvent) {
    const {
      nativeEvent: { data },
    } = event;

    let message = undefined;
    try {
      message = JSON.parse(data);
    } catch (e) {
      // no-op
    }

    if (!message || !message.type || !message.id) return;

    if (message.type === "request") {
      const request = message as MessageRequest;
      const { id, method, payload } = request;

      const response: MessageResponse = { type: "response", id, payload: {} };

      if (method in this.requestHandlers) {
        response.payload = await this.requestHandlers[method](payload, id);
      } else {
        // TODO: method not found error response?
      }

      this.webview?.postMessage(JSON.stringify(response));
    }
  }
}
