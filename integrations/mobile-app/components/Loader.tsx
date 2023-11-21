import { StyleSheet, SafeAreaView, StyleProp, ViewStyle } from "react-native";
import LottieView from "lottie-react-native";
import useAppShellHost from "../lib/appShellHost";
import useDelay from "../lib/useDelay";

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

export type ConditionalLoaderProps = {
  delay: number;
};
export function ConditionalLoader({ delay = 100 }) {
  const appShellHost = useAppShellHost();
  const loading = appShellHost.state?.loading;
  const shouldShow = useDelay({ delay, active: loading });

  if (!shouldShow) return <></>;
  return <Loader style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} />;
}
