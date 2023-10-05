import type { Meta, StoryObj } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import WebViewNavToolbar, { WebViewNavToolbarProps } from "./WebViewNavToolbar";

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

const baseArgs ={
  siteBaseUrl: mockSiteBaseUrl,
  webview: mockWebview,
  webviewNavigation: mockWebviewNavigation,
  showReload: true,
};

export default {
  title: "components/WebViewNavToolbar",
  component: WebViewNavToolbar,
  decorators: [],
} satisfies Meta<typeof WebViewNavToolbar>;

type Story = StoryObj<typeof WebViewNavToolbar>;

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
