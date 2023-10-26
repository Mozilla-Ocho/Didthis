import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import WebAppScreen, { WebAppScreenRouteParams } from "./screens/WebApp";
import DoTheThingScreen, {
  DoTheThingScreenRouteParams,
} from "./screens/DoTheThing";
import SigninScreen, { SigninScreenRouteParams } from "./screens/Signin";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import AppShellHostContextProvider from "./lib/appShellHost/context";
import Config from "./lib/config";
import useAppFonts from "./lib/fonts";
import Loader from "./components/Loader";

export type RootStackParamList = {
  Signin: SigninScreenRouteParams;
  WebApp: WebAppScreenRouteParams;
  DoTheThing: DoTheThingScreenRouteParams;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const [fontsLoaded, fontError] = useAppFonts();

  if (!fontsLoaded) {
    return <Loader />;
  }
  if (fontError) {
    console.error(fontError);
  }

  return (
    <NavigationContainer>
      <AppShellHostContextProvider>
        <AppMainStack />
      </AppShellHostContextProvider>
    </NavigationContainer>
  );
}

type AppMainStackProps = {};

function AppMainStack({}: AppMainStackProps) {
  const screenOptions: StackNavigationOptions = {
    headerShown: false,
    /*
    headerRight: () => <LogoTitle />,
    headerLeft: () => (
      <TouchableOpacity
        style={styles.drawerButton}
        onPress={() => setDrawerOpen((prevOpen) => !prevOpen)}
      >
        <FontAwesomeIcon icon={menuIcon} />
      </TouchableOpacity>
    ),
    headerTitle: () => <Text>Didthis ({Updates.channel})</Text>,
    headerStyle: {
      backgroundColor: colors["yellow-300"],
    },
    headerTintColor: "#000",
    headerTitleStyle: {
      fontWeight: "bold",
    },
    */
  };

  return (
    <Stack.Navigator
      detachInactiveScreens={false}
      screenOptions={screenOptions}
    >
      <Stack.Screen name="Signin" component={SigninScreen} />
      <Stack.Screen name="WebApp" component={WebAppScreen} />
      <Stack.Screen name="DoTheThing" component={DoTheThingScreen} />
    </Stack.Navigator>
  );
}

let AppEntryPoint = App;

if (Config.storybookEnabled) {
  AppEntryPoint = require("./.storybook").default;
}

export default AppEntryPoint;
