/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useMemo } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createInitialState, useAppShellHostState } from "./state";
import AppShellHostAPI from "./api";
import { RootStackParamList } from "../../App";

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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [state, dispatch] = useAppShellHostState();
  const appShellHostAPI = useMemo(
    () => new AppShellHostAPI(state, dispatch, navigation),
    [state, dispatch, navigation]
  );
  return (
    <AppShellHostContext.Provider value={appShellHostAPI}>
      {children}
    </AppShellHostContext.Provider>
  );
}
