import { useContext, useEffect } from 'react'
import { AppShellContext } from './context'

export { useAppShellListener } from './messaging'
export { useAppShellTopBar } from "./ui"

export default function useAppShell() {
  return useContext(AppShellContext)
}

