import type { Meta, StoryObj } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import DateTimePicker, { DateTimePickerProps } from "./DateTimePicker";
import { ThemedSafeViewDecorator } from "../lib/storybook/decorators";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import type { ReactNativeFramework } from "@storybook/react-native";
import { PartialStoryFn } from "@storybook/csf";

const Subject = DateTimePicker;
type SubjectProps = DateTimePickerProps;
type SubjectType = typeof DateTimePicker;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "components/DateTimePicker",
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
        backgroundColor: colors.background,
        flexDirection: "column",
      }}
    >
      <Story />
    </View>
  );
}

type Story = StoryObj<SubjectType>;

const baseArgs = {};

export const Default: Story = {
  args: baseArgs,
};
