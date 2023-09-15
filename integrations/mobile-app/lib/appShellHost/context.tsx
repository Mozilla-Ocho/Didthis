/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useEffect, useMemo } from "react";
import { Text } from "react-native";

import {
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";

import * as ImagePicker from "expo-image-picker";
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

  const { messaging } = state;
  messaging.registerMethod("pickImage", async () => {
    const result = await pickImage();
    return JSON.parse(JSON.stringify(result));
  });
  messaging.registerMethod("doThing", async (payload, id) => {
    const response = appShellHostAPI.messaging.deferResponse(id);
    navigation.navigate("DoTheThing", { requestId: id, payload });
    return response;
  });

  return (
    <AppShellHostContext.Provider value={appShellHostAPI}>
      {children}
    </AppShellHostContext.Provider>
  );
}

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    exif: true,
    base64: true,
    allowsMultipleSelection: false,
  });
  if (!result.canceled) {
    return result.assets[0];
  }
};
