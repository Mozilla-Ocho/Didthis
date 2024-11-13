import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNativeFramework } from "@storybook/react-native";
import { PartialStoryFn } from "@storybook/csf";
import { action } from "@storybook/addon-actions";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

import { OfflineWarningModal, OfflineWarningModalProps } from "./OfflineWarning";

import { ThemedSafeViewDecorator } from "../lib/storybook/decorators";

const Subject = OfflineWarningModal;
type SubjectProps = OfflineWarningModalProps;
type SubjectType = typeof OfflineWarningModal;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "components/OfflineWarningModal",
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
      <Story />
    </View>
  );
}

type Story = StoryObj<SubjectType>;

const baseArgs: Partial<OfflineWarningModalProps> = {
  shown: true,
};

export const Default: Story = {
  args: baseArgs,
};
