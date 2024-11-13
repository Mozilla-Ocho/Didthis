import { useContext } from "react"
import { AppShellHostContext } from "./context"

export function useAppShellHost() {
  return useContext(AppShellHostContext)
}

export default useAppShellHost