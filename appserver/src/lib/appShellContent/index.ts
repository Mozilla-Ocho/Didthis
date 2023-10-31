import { useContext } from 'react';
import { AppShellContext } from './context';

export { useAppShellListener } from "./messaging";

export default function useAppShell() {
  return useContext(AppShellContext)
}
