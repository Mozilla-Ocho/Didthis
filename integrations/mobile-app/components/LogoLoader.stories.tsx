import type { Meta, StoryObj } from "@storybook/react-native";
import LogoLoader, { LogoLoaderProps } from "./LogoLoader";
import { ThemedSafeViewDecorator } from "../lib/storybook/decorators";

const Subject = LogoLoader;
type SubjectProps = LogoLoaderProps;
type SubjectType = typeof LogoLoader;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "components/LogoLoader",
  component: Subject,
  decorators: [ThemedSafeViewDecorator<SubjectArgs>],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

const baseArgs: SubjectArgs = {};

export const Default: Story = {
  args: baseArgs,
};
