import "react-native-gesture-handler";
import * as React from "react";
import { Image } from "react-native";
import Constants from "expo-constants";
import { NavigationContainer } from "@react-navigation/native";
import AppShellHostContextProvider from "./lib/appShellHost/context";
import WebAppScreen, { WebAppScreenRouteParams } from "./screens/WebApp";
import DoTheThingScreen, { DoTheThingScreenRouteParams } from "./screens/DoTheThing";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";

export type RootStackParamList = {
  WebApp: WebAppScreenRouteParams;
  DoTheThing: DoTheThingScreenRouteParams;
};

const Stack = createStackNavigator<RootStackParamList>();

function LogoTitle() {
  return (
    <Image
      style={{ width: 48, height: 48 }}
      source={require("./assets/didthis-snap-logo.png")}
    />
  );
}

function App() {
  const screenOptions: StackNavigationOptions = {
    headerTitle: () => <LogoTitle />,
    headerStyle: {
      backgroundColor: "#fff1a6",
    },
    headerTintColor: "#000",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };

  return (
    <NavigationContainer>
      <AppShellHostContextProvider>
        <Stack.Navigator
          detachInactiveScreens={false}
          screenOptions={screenOptions}
        >
          <Stack.Screen name="WebApp" component={WebAppScreen} />
          <Stack.Screen name="DoTheThing" component={DoTheThingScreen} />
        </Stack.Navigator>
      </AppShellHostContextProvider>
    </NavigationContainer>
  );
}

let AppEntryPoint = App;

if (Constants.expoConfig.extra.storybookEnabled === "true") {
  AppEntryPoint = require("./.storybook").default;
}

export default AppEntryPoint;
