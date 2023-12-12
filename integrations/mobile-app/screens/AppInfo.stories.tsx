import type { Meta, StoryObj } from "@storybook/react-native";
import AppInfoScreen, { AppInfoScreenProps } from "./AppInfo";
import { action } from "@storybook/addon-actions";
import { ThemedNavigationContainer } from "../lib/storybook/decorators";

const Subject = AppInfoScreen;
type SubjectProps = AppInfoScreenProps;
type SubjectType = typeof AppInfoScreen;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "screens/AppInfoScreen",
  component: Subject,
  decorators: [
    ThemedNavigationContainer<SubjectArgs>,
  ],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

const actionNavigate = action("navigate");
const actionGoBack = action("goBack");

const baseArgs: Partial<SubjectArgs> = {
  // @ts-ignore mocking navigate() only
  navigation: {
    goBack: actionGoBack,
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
