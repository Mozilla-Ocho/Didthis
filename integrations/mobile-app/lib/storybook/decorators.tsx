import type { ReactNativeFramework } from "@storybook/react-native";
import { PartialStoryFn } from "@storybook/csf";
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { SafeAreaView, useColorScheme, StyleSheet } from "react-native";

export function ThemedNavigationContainer<TArgs>(
  Story: PartialStoryFn<ReactNativeFramework, TArgs>
) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={theme}>
      <Story />
    </NavigationContainer>
  );
}

export function ThemedSafeViewDecorator<TArgs>(
  Story: PartialStoryFn<ReactNativeFramework, TArgs>
) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const { colors } = theme;

  return (
    <NavigationContainer theme={theme}>
      <SafeAreaView
        style={{
          ...StyleSheet.absoluteFillObject,
          flexDirection: "column",
          backgroundColor: colors.background
        }}
      >
        <Story />
      </SafeAreaView>
    </NavigationContainer>
  );
}
