import type { Meta, StoryObj } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import TopNav, { TopNavProps } from "./TopNav";

export default {
  title: "components/TopNav",
  component: TopNav,
  decorators: [],
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

export const WithChevrons: Story = {
  args: {...baseArgs, leftIsBack: true, rightIsForward: true }
};

export const WithoutButtons: Story = {
  args: {...baseArgs, onLeftPress: undefined, onRightPress: undefined }
};

export const WithoutLeft: Story = {
  args: {...baseArgs, onLeftPress: undefined }
};

export const WithoutRight: Story = {
  args: {...baseArgs, onRightPress: undefined }
};
