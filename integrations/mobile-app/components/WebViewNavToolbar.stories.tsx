import type { Meta, StoryObj } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import WebViewNavToolbar, { WebViewNavToolbarProps } from "./WebViewNavToolbar";
import { ThemedSafeViewDecorator } from "../lib/storybook/decorators";

const Subject = WebViewNavToolbar;
type SubjectProps = WebViewNavToolbarProps;
type SubjectType = typeof WebViewNavToolbar;
type SubjectArgs = Partial<SubjectProps>;

export default {
  title: "components/WebViewNavToolbar",
  component: Subject,
  decorators: [ThemedSafeViewDecorator<SubjectArgs>],
} satisfies Meta<SubjectType>;

type Story = StoryObj<SubjectType>;

const mockSiteBaseUrl = 'https://example.com'

const mockWebview: WebViewNavToolbarProps["webview"] = {
  reload: action("reload"),
  goBack: action("goBack"),
  goForward: action("goForward"),
  injectJavaScript: action("injectJavascript"),
};

const mockWebviewNavigation = {
  canGoBack: false,
  canGoForward: false,
  url: mockSiteBaseUrl
};

const baseArgs = {
  siteBaseUrl: mockSiteBaseUrl,
  webview: mockWebview,
  webviewNavigation: mockWebviewNavigation,
  showReload: true,
};

export const Default: Story = {
  args: baseArgs,
};

export const WithoutReload: Story = {
  args: {
    ...baseArgs,
    showReload: false,
  },
};

export const CanGoBack: Story = {
  args: {
    ...baseArgs,
    webviewNavigation: {
      ...mockWebviewNavigation,
      canGoBack: true,
    }
  },
};

export const CanGoForward: Story = {
  args: {
    ...baseArgs,
    webviewNavigation: {
      ...mockWebviewNavigation,
      canGoForward: true,
    }
  },
};
