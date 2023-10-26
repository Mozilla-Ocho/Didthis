import "react-native-gesture-handler";
import * as React from "react";
import {
  Image,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
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
import { Button, View } from "react-native";
import { Drawer } from "react-native-drawer-layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars as menuIcon } from "@fortawesome/free-solid-svg-icons/faBars";
import { faPlus as addIcon } from "@fortawesome/free-solid-svg-icons/faPlus";
import AppShellHostContextProvider from "./lib/appShellHost/context";
import { useAppShellHost } from "./lib/appShellHost/index";
import { colors, styles } from "./styles";
import Config from "./lib/config";
import { useFonts } from 'expo-font';
import * as Updates from "expo-updates";
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

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <NavigationContainer>
      <AppShellHostContextProvider>
        <Drawer
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
          renderDrawerContent={() => (
            <AppGlobalDrawer {...{ drawerOpen, setDrawerOpen }} />
          )}
        >
          <AppMainStack {...{ drawerOpen, setDrawerOpen }} />
          <AppGlobalAddButton {...{ drawerOpen, setDrawerOpen }} />
        </Drawer>
      </AppShellHostContextProvider>
    </NavigationContainer>
  );
}

type DrawerManagementProps = {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function LogoTitle() {
  const appShellHost = useAppShellHost();
  const { user, links } = appShellHost.state;
  const source = user
    ? { url: user.profile.imageMeta.url }
    : require("./assets/didthis-snap-logo.png");

  return (
    <TouchableOpacity
      onPress={() => appShellHost.navigateToPath(links.user)}
      activeOpacity={0.5}
    >
      <Image style={{ width: 42, height: 42 }} source={source} />
    </TouchableOpacity>
  );
}

type AppGlobalAddButtonProps = {} & DrawerManagementProps;

function AppGlobalAddButton({
  drawerOpen,
  setDrawerOpen,
}: AppGlobalAddButtonProps) {
  const appShellHost = useAppShellHost();
  const { links } = appShellHost.state;
  if (!links.newPost) return;

  return (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => {
        setDrawerOpen(false);
        appShellHost.navigateToPath(links.newPost);
      }}
      activeOpacity={0.5}
    >
      <FontAwesomeIcon icon={addIcon} />
    </TouchableOpacity>
  );
}

type AppGlobalDrawerProps = {} & DrawerManagementProps;

function AppGlobalDrawer({ drawerOpen, setDrawerOpen }: AppGlobalDrawerProps) {
  const appShellHost = useAppShellHost();
  const { user, links } = appShellHost.state;
  if (!user) return;

  const source = user
    ? { url: user.profile.imageMeta.url }
    : require("./assets/didthis-snap-logo.png");

  return (
    <SafeAreaView style={styles.drawer}>
      <Image style={{ width: 64, height: 64 }} source={source} />
      <Text>User: {user.profile.name}</Text>
      <Text>Bio: {user.profile.bio}</Text>
      <Button
        title="Edit user"
        onPress={() => {
          setDrawerOpen(false);
          appShellHost.navigateToPath(links.userEdit);
        }}
      />
    </SafeAreaView>
  );
}
type AppMainStackProps = {} & DrawerManagementProps;

function AppMainStack({ drawerOpen, setDrawerOpen }: AppMainStackProps) {
  const screenOptions: StackNavigationOptions = {
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
