import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import useDelay from "../lib/useDelay";
import ActivityIndicator from "./ActivityIndicator";

export type OfflineWarningModalProps = {
  shown: boolean;
};

export function OfflineWarningModal({
  shown = false,
}: OfflineWarningModalProps) {
  if (!shown) return <></>;
  return (
    <View style={styles.container}>
      <ActivityIndicator
        intent="error"
        label="Network offline, waiting to reconnect"
      />
    </View>
  );
}

export type OfflineWarningProps = {
  delay?: number;
};

export default function OfflineWarning({ delay = 100 }: OfflineWarningProps) {
  const { isInternetReachable } = useNetInfo();
  const isOffline = isInternetReachable !== true;
  const shouldShow = useDelay({ active: isOffline, delay });

  return <OfflineWarningModal shown={shouldShow} />;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    position: "absolute",
    left: 0,
    top: 0,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
