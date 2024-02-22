import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Config from "../lib/config";
import TopNav from "../components/TopNav";
import AppShellWebView from "../components/AppShellWebView";

const { siteBaseUrl } = Config;

export type RouteParams = {
  resetWebViewAfter?: number;
};

export type WebAppSignInScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "WebApp"
>;

export default function WebAppSigninScreen({
  route,
  navigation,
}: WebAppSignInScreenProps) {
  const { resetWebViewAfter = 0 } = route.params || {};

  const onCancelSignin = () => {
    navigation.navigate("Signin");
  };

  return (
    <AppShellWebView
      source={{ uri: `${siteBaseUrl}/signinWithEmail` }}
      resetWebViewAfter={resetWebViewAfter}
      header={() => (
        <TopNav
          title="Sign in with Email"
          leftIsBack
          onLeftPress={onCancelSignin}
        />
      )}
    />
  );
}
