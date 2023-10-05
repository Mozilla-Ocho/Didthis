import { useReducer, Dispatch } from 'react'
import AppShellHostAPI from './api'
import MessageHandler from './messaging'
import { ApiUser } from "../types"

export type State = {
  messaging: MessageHandler,
  user?: ApiUser,
  links: Record<string, string>
}

export function createInitialState(): State {
  return {
    messaging: new MessageHandler(),
    links: {}
  }
}

type ObjectUpdateAction<T extends string, C extends object> = {
  [K in keyof C]: {
    type: T
    key: K
    value: C[K]
  }
}[keyof C]

export type Action = ObjectUpdateAction<'update', State>

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'update':
      return { ...state, [action.key]: action.value }
    default:
      return state
  }
}

export function useAppShellHostState(): [State, Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, null, createInitialState)

  return [state, dispatch]
}
