import type { Meta, StoryObj } from "@storybook/react-native";
import DateTimePickerScreen, {
  DateTimePickerScreenProps,
} from "./DateTimePicker";
import { action } from "@storybook/addon-actions";
import { ThemedNavigationContainer } from "../lib/storybook/decorators";
import { AppShellHostContext } from "../lib/appShellHost/context";
import AppShellHostAPI from "../lib/appShellHost/api";

const Subject = DateTimePickerScreen;
type SubjectProps = DateTimePickerScreenProps;
type SubjectType = typeof DateTimePickerScreen;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "screens/DateTimePickerScreen",
  component: Subject,
  decorators: [ThemedNavigationContainer<SubjectArgs>],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

const actionNavigate = action("navigate");

const baseArgs: Partial<SubjectArgs> = {
  // @ts-ignore mocking navigate()
  navigation: {
    // @ts-ignore
    navigate: (screen: string, params: object) => {
      console.log("navigate", screen, JSON.stringify(params, null, "  "));
      actionNavigate(screen, params);
    },
  },
  // @ts-ignore only mocking credential param
  route: {
    params: {
      requestId: "8675309",
      title: "Did this when?",
      initialDateTime: new Date("2024-11-01T01:23:45Z").getTime(),
    },
  },
};

const baseMessaging: Partial<AppShellHostAPI["messaging"]> = {
  getDeferredResponse: (id: string) => {
    return {
      resolve: action("resolve"),
      reject: action("reject"),
    };
  },
};

const baseAppShell: Partial<AppShellHostAPI> = {
  messaging: baseMessaging as AppShellHostAPI["messaging"],
};

export const Default: Story = {
  args: baseArgs,
  decorators: [
    (Story) => {
      return (
        <AppShellHostContext.Provider value={baseAppShell as AppShellHostAPI}>
          <Story />
        </AppShellHostContext.Provider>
      );
    },
  ],
};
