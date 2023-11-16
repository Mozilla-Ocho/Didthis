import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppShellHostContextProvider from "./lib/appShellHost/context";
import Config from "./lib/config";
import useAppFonts from "./lib/fonts";
import LogoLoader from "./components/LogoLoader";
import { globalTheme } from "./styles";
import * as ScreenOrientation from 'expo-screen-orientation';

import WebAppScreen, { WebAppScreenRouteParams } from "./screens/WebApp";
import SigninScreen, { SigninScreenRouteParams } from "./screens/Signin";
import StartupScreen, { StartupScreenRouteParams } from "./screens/Startup";
import * as Onboarding from "./screens/Onboarding";
import * as DateTimePicker from "./screens/DateTimePicker";
import { ConditionalLoader } from "./components/Loader";

export type RootStackParamList = {
  Startup: StartupScreenRouteParams;
  Signin: SigninScreenRouteParams;
  WebApp: WebAppScreenRouteParams;
  Onboarding: Onboarding.RouteParams;
  DateTimePicker: DateTimePicker.RouteParams;
};

const Stack = createStackNavigator<RootStackParamList>();

// https://docs.expo.dev/versions/latest/sdk/screen-orientation/
// note that PORTRAIT doesn't work, it's gotta be PORTRAIT_UP
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});

function App() {
  const [fontsLoaded, fontError] = useAppFonts();

  if (!fontsLoaded) return <LogoLoader />;
  if (fontError) {
    console.error(fontError);
  }

  return (
    <NavigationContainer theme={globalTheme}>
      <AppShellHostContextProvider>
        <Stack.Navigator
          detachInactiveScreens={false}
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Startup" component={StartupScreen} />
          <Stack.Screen name="Signin" component={SigninScreen} />
          <Stack.Screen name="Onboarding" component={Onboarding.default} />
          <Stack.Screen name="WebApp" component={WebAppScreen} />
          <Stack.Screen name="DateTimePicker" component={DateTimePicker.default} />
        </Stack.Navigator>
        <ConditionalLoader />
      </AppShellHostContextProvider>
    </NavigationContainer>
  );
}

let AppEntryPoint = App;
if (Config.storybookEnabled) {
  AppEntryPoint = require("./.storybook").default;
}

export default AppEntryPoint;
