import {
  StyleSheet, SafeAreaView,
  StyleProp,
  ViewStyle
} from "react-native";
import LottieView from "lottie-react-native";
import useAppShellHost from "../lib/appShellHost";

export type LoaderProps = {
  style?: StyleProp<ViewStyle>;
};

export default function Loader({ style }: LoaderProps) {
  return (
    <SafeAreaView
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          flexDirection: "column",
        },
        style,
      ]}
    >
      <LottieView
        style={{ flexGrow: 1 }}
        source={require("../assets/SparkleLoader.json")}
        autoPlay={true}
        loop={true}
      />
    </SafeAreaView>
  );
}

export function WebviewRouteChangeLoader() {
  const appShellHost = useAppShellHost();
  const webContentRouteChanging = appShellHost.state?.webContentRouteChanging;
  if (!webContentRouteChanging) return <></>;

  return (
    <Loader style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} />
  );
}