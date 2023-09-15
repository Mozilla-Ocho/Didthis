import { useReducer, Dispatch } from 'react'
import AppShellHostAPI from './api'
import MessageHandler from './messaging'

export function createInitialState() {
  return {
    messaging: new MessageHandler(),
  }
}

export type State = ReturnType<typeof createInitialState>

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
