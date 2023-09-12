import * as React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import Constants from "expo-constants";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen, { HomeScreenRouteParams } from "./screens/Home";
import ProjectsScreen, { ProjectsScreenRouteParams } from "./screens/Projects";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import DidthisWebScreen, { DidthisWebScreenRouteParams } from "./screens/DidThisWeb";

export type RootStackParamList = {
  Home: HomeScreenRouteParams;
  Projects: ProjectsScreenRouteParams;
  DidthisWeb: DidthisWebScreenRouteParams;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function LogoTitle(props: any) {
  return (
    <Image
      style={{ width: 48, height: 48 }}
      source={require("./assets/didthis-snap-logo.png")}
    />
  );
}

function App() {
  const headerTitle = (props) => <LogoTitle {...props} />;

  const headerRight = () => (
    <Button
      onPress={() => alert("This is a button!")}
      title="Info"
      color="#fff"
    />
  );

  const screenOptions: NativeStackNavigationOptions = {
    headerTitle,
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
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          options={{
            //headerRight,
          }}
        >
          {(props) => <HomeScreen {...props} foo="bar" />}
        </Stack.Screen>
        <Stack.Screen name="DidthisWeb" component={DidthisWebScreen} />
        <Stack.Screen name="Projects" component={ProjectsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

let AppEntryPoint = App;

if (Constants.expoConfig.extra.storybookEnabled === "true") {
  AppEntryPoint = require("./.storybook").default;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppEntryPoint;
