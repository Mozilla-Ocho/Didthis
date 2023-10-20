import type { Meta, StoryObj } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import DateTimePicker, { DateTimePickerProps } from "./DateTimePicker";

export default {
  title: "components/DateTimePicker",
  component: DateTimePicker,
  decorators: [],
} satisfies Meta<typeof DateTimePicker>;

type Story = StoryObj<typeof DateTimePicker>;

const baseArgs = {};

export const Default: Story = {
  args: baseArgs,
};
