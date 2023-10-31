import type { Meta, StoryObj } from "@storybook/react-native";
import Loader, { LoaderProps } from "./Loader";
import { ThemedSafeViewDecorator } from "../lib/storybook/decorators";

const Subject = Loader;
type SubjectProps = LoaderProps;
type SubjectType = typeof Loader;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "components/Loader",
  component: Subject,
  decorators: [ThemedSafeViewDecorator<SubjectArgs>],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

const baseArgs: SubjectArgs = {};

export const Default: Story = {
  args: baseArgs,
};
