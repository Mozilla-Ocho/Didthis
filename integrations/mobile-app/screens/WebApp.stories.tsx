import type { Meta, StoryObj } from "@storybook/react-native";
import WebAppScreen, { WebAppScreenProps } from "./WebApp";
import { action } from "@storybook/addon-actions";
import { ThemedNavigationContainer } from "../lib/storybook/decorators";
import AppShellHostContextProvider from "../lib/appShellHost/context";

const Subject = WebAppScreen;
type SubjectProps = WebAppScreenProps;
type SubjectType = typeof WebAppScreen;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "screens/WebAppScreen",
  component: Subject,
  decorators: [
    (Story) => (
      <AppShellHostContextProvider>
        <Story />
      </AppShellHostContextProvider>
    ),
    ThemedNavigationContainer<SubjectArgs>,
  ],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

// TODO: find a better way to demo this?
const credential = {
  user: "867530.968758b845e645b5990bdacda2292b88.0006",
  email: null,
  realUserStatus: 1,
  authorizationCode: "sdfasdfasdf",
  fullName: {
    givenName: null,
    middleName: null,
    familyName: null,
    nickname: null,
    namePrefix: null,
    nameSuffix: null,
  },
  state: null,
  identityToken: "sdfgadfasdf"
};

const baseArgs: Partial<SubjectArgs> = {
  // @ts-ignore only mocking credential param
  route: {
    params: {
      // credential,
    },
  },
};

export const Default: Story = {
  args: baseArgs,
};
