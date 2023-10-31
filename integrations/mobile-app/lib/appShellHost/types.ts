import { ApiUser } from "../types"
import { AppleAuthenticationCredential } from "expo-apple-authentication"

// TODO: share this with react native project to define expected app message payloads
export type AppMessages = {
  response: JSONObject
  appleCredential: { credential: AppleAuthenticationCredential }
  topNavLeftPress: { label: string },
  topNavRightPress: { label: string },
}

export type AppRequestMethods = {
  ping: {
    request: undefined,
    response: JSONObject,
  }
  signin: {
    request: undefined,
    response: JSONObject,
  }
  useScreen: {
    request: JSONObject,
    response: JSONObject,
  }
  updateAppConfig: {
    request: {
      user: ApiUser
      links: Record<string, string>
    }
    response: JSONObject
  }
  updateTopNav: {
    request: {
      show: boolean,
      title?: string,
      leftLabel?: string,
      rightLabel?: string,
      leftIsBack?: boolean,
    }
    response: JSONObject
  }
  pickImage: {
    request: JSONObject
    response: JSONObject
  }
}

export type Success = { success: true }

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

export interface JSONObject {
  [k: string]: JSONValue
}
