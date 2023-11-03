import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNativeFramework } from "@storybook/react-native";
import { PartialStoryFn } from "@storybook/csf";
import { action } from "@storybook/addon-actions";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

import TopNav, { TopNavProps } from "./TopNav";

import { ThemedSafeViewDecorator } from "../lib/storybook/decorators";

const Subject = TopNav;
type SubjectProps = TopNavProps;
type SubjectType = typeof TopNav;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "components/TopNav",
  component: Subject,
  decorators: [MockAppDecorator, ThemedSafeViewDecorator<SubjectArgs>],
} satisfies Meta<SubjectType>;

function MockAppDecorator(
  Story: PartialStoryFn<ReactNativeFramework, SubjectArgs>
) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        flexDirection: "column",
      }}
    >
      <View>
        <Story />
      </View>
      <View style={{ flexGrow: 1, padding: 16, justifyContent: "center" }}>
        <Text style={{ color: colors.text, padding: 48 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </View>
      <View style={{ flexGrow: 0, padding: 16 }}>
        <Text style={{ color: colors.text }}>
          Bottom bar Duis aute irure dolor in reprehenderit
        </Text>
      </View>
    </View>
  );
}

type Story = StoryObj<SubjectType>;

const baseArgs: Partial<TopNavProps> = {
  title: "Did this example?",
  leftIsBack: false,
  leftIsDisabled: false,
  leftLabel: "Cancel",
  rightIsDisabled: false,
  rightLabel: "Save",
  showShare: false,
  shareIsDisabled: false,
  showEdit: false,
  editIsDisabled: false,
  onLeftPress: action("onLeftPress"),
  onRightPress: action("onRightPress"),
  onSharePress: action("onSharePress"),
  onEditPress: action("onEditPress"),
};

export const Default: Story = {
  args: baseArgs,
};

export const NoTitle: Story = {
  args: { ...baseArgs, title: undefined },
};

export const LeftOnly: Story = {
  args: { ...baseArgs, rightLabel: undefined },
};

export const LeftDisabled: Story = {
  args: { ...baseArgs, leftIsDisabled: true },
};

export const LeftIsBack: Story = {
  args: { ...baseArgs, leftIsBack: true },
};

export const LeftIsBackDisabled: Story = {
  args: {
    ...baseArgs,
    leftIsBack: true,
    leftIsDisabled: true,
  },
};

export const RightOnly: Story = {
  args: { ...baseArgs, leftLabel: undefined },
};

export const TitleOnly: Story = {
  args: { ...baseArgs, leftLabel: undefined, rightLabel: undefined },
};

export const RightDisabled: Story = {
  args: { ...baseArgs, rightIsDisabled: true },
};

export const ShareAndEdit: Story = {
  args: { ...baseArgs, rightLabel: undefined, showShare: true, showEdit: true },
};
