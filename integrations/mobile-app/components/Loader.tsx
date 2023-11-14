import { StyleSheet, SafeAreaView, StyleProp, ViewStyle } from "react-native";
import LottieView from "lottie-react-native";
import useAppShellHost from "../lib/appShellHost";
import { useEffect, useRef, useState } from "react";

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    setDelayPassed(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (loading) {
      timerRef.current = setTimeout(() => {
        timerRef.current = undefined;
        setDelayPassed(true);
      }, delay);
    }
  }, [loading, delay, timerRef, setDelayPassed]);

  const shouldShow = loading && delayPassed;
  if (!shouldShow) return <></>;
  return <Loader style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} />;
}
