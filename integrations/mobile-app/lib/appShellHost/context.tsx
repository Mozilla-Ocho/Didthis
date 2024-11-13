/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useEffect, useMemo, useRef } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createInitialState, useAppShellHostState } from "./state";
import AppShellHostAPI from "./api";
import { RootStackParamList } from "../../App";
import MessageHandler from "./messaging";

export type State = ReturnType<typeof createInitialState>;

export const AppShellHostContext = createContext<AppShellHostAPI>(
  new AppShellHostAPI()
);

export type AppShellHostContextProps = {
  children: ReactNode;
};

export default function AppShellHostContextProvider({
  children,
}: AppShellHostContextProps) {
  const [state, dispatch] = useAppShellHostState();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const messaging = useMemo(() => new MessageHandler(), []);
  const appShellHostAPI = useMemo(
    () => new AppShellHostAPI({ state, dispatch, navigation, messaging }),
    [state, dispatch, navigation, messaging]
  );
  return (
    <AppShellHostContext.Provider value={appShellHostAPI}>
      {children}
    </AppShellHostContext.Provider>
  );
}
