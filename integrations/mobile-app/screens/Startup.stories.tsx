import type { Meta, StoryObj } from "@storybook/react-native";
import StartupScreen, { StartupScreenProps } from "./Startup";
import { action } from "@storybook/addon-actions";
import { ThemedNavigationContainer } from "../lib/storybook/decorators";

const Subject = StartupScreen;
type SubjectProps = StartupScreenProps;
type SubjectType = typeof StartupScreen;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "screens/StartupScreen",
  component: Subject,
  decorators: [
    ThemedNavigationContainer<SubjectArgs>,
  ],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

const actionNavigate = action("navigate");

const baseArgs: Partial<SubjectArgs> = {
  // @ts-ignore mocking navigate() only
  navigation: {
    // @ts-ignore
    navigate: (screen: string, params: object) => {
      console.log("navigate", screen, JSON.stringify(params, null, "  "));
      actionNavigate(screen, params);
    }
  }
};

export const Default: Story = {
  args: baseArgs,
};
