import type { Meta, StoryObj } from "@storybook/react-native";
import { PartialStoryFn } from "@storybook/csf";
import AppleSigninButton, { AppleSigninButtonProps } from "./AppleSigninButton";
import { ThemedSafeViewDecorator } from "../lib/storybook/decorators";
import { action } from "@storybook/addon-actions";
import { SafeAreaView } from "react-native-safe-area-context";

const Subject = AppleSigninButton;
type SubjectProps = AppleSigninButtonProps;
type SubjectType = typeof AppleSigninButton;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "components/AppleSigninButton",
  component: Subject,
  decorators: [
    (Story) => (
      <SafeAreaView
        style={{ flex: 1, alignContent: "center", alignItems: "center" }}
      >
        <Story />
      </SafeAreaView>
    ),
    ThemedSafeViewDecorator<SubjectArgs>,
  ],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

const baseArgs: Partial<SubjectArgs> = {
  onSignin: action("signin"),
  onCancel: action("cancel"),
  onError: action("error"),
};

export const Default: Story = {
  args: baseArgs,
};
