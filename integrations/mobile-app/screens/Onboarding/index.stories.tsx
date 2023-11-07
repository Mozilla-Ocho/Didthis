import type { Meta, StoryObj } from "@storybook/react-native";
import OnboardingScreen, { OnboardingScreenProps } from ".";
import { action } from "@storybook/addon-actions";
import { ThemedNavigationContainer } from "../../lib/storybook/decorators";

const Subject = OnboardingScreen;
type SubjectProps = OnboardingScreenProps;
type SubjectType = typeof OnboardingScreen;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "screens/OnboardingScreen",
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
