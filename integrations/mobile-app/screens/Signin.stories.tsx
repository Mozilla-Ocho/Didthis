import type { Meta, StoryObj } from "@storybook/react-native";
import SigninScreen, { SigninScreenProps } from "./Signin";
import { action } from "@storybook/addon-actions";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";

const Subject = SigninScreen;
type SubjectProps = SigninScreenProps;
type SubjectType = typeof SigninScreen;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "screens/SigninScreen",
  component: Subject,
  decorators: [
    (Story) => {
      const colorScheme = useColorScheme();
      const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
      return (
        <NavigationContainer theme={theme}>
          <Story />
        </NavigationContainer>
      );
    },
  ],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

const actionSignin = action("signinNew");

const baseArgs: Partial<SubjectArgs> = {};

export const Default: Story = {
  args: baseArgs,
};
