import type { Meta, StoryObj } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  useColorScheme,
} from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from "@react-navigation/native";

import TopNav, { TopNavProps } from "./TopNav";

export default {
  title: "components/TopNav",
  component: TopNav,
  decorators: [
    (Story) => {
      const colorScheme = useColorScheme();
      // const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
      const theme = DefaultTheme;
      const { colors } = theme;

      return (
        <NavigationContainer theme={theme}>
          <SafeAreaView
            style={{
              ...StyleSheet.absoluteFillObject,
              flexDirection: "column",
              marginTop: -47, // HACK: account for nav header asserting its own margin in storybook
            }}
          >
            <Story />
            <View
              style={{ flexGrow: 1, padding: 16, justifyContent: "center" }}
            >
              <Text style={{ color: colors.text, padding: 48 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>
            </View>
            <View style={{ flexGrow: 0, padding: 16 }}>
              <Text style={{ color: colors.text }}>Bottom bar Duis aute irure dolor in reprehenderit</Text>
            </View>
          </SafeAreaView>
        </NavigationContainer>
      );
    },
  ],
} satisfies Meta<typeof TopNav>;

type Story = StoryObj<typeof TopNav>;

const baseArgs = {
  title: "Did this example?",
  onLeftPress: action("onLeftPress"),
  leftLabel: "Cancel",
  onRightPress: action("onRightPress"),
  rightLabel: "Save",
};

export const Default: Story = {
  args: baseArgs,
};

export const LeftOnly: Story = {
  args: { ...baseArgs, rightLabel: undefined },
};

export const LeftDisabled: Story = {
  args: { ...baseArgs, onLeftPress: undefined },
};

export const LeftIsBack: Story = {
  args: { ...baseArgs, leftIsBack: true, rightIsForward: true },
};

export const LeftIsBackDisabled: Story = {
  args: {
    ...baseArgs,
    leftIsBack: true,
    leftLabel: "Back",
    onLeftPress: undefined,
  },
};

export const RightOnly: Story = {
  args: { ...baseArgs, leftLabel: undefined },
};

export const TitleOnly: Story = {
  args: { ...baseArgs, leftLabel: undefined, rightLabel: undefined },
};

export const RightDisabled: Story = {
  args: { ...baseArgs, onRightPress: undefined },
};
