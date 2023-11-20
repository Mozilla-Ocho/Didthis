import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import RollingLoaderImage from "../assets/rolling-loader.svg";
import { fonts, colors } from "../styles";
import { useEffect, useRef, useState } from "react";

export type ActivityIndicatorProps = {
  label?: string;
  spinner?: boolean;
  spinnerPeriod?: number;
  intent?: "activity" | "error";
};

export default function ActivityIndicator({
  label = "Working",
  spinner = true,
  spinnerPeriod = 1000,
  intent = "activity",
}: ActivityIndicatorProps) {
  const spin = useSpinnerAnimation(spinner, spinnerPeriod);
  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.loaderCapsule,
          ...(intent === "activity"
            ? styles.loaderCapsuleActivity
            : styles.loaderCapsuleError),
        }}
      >
        {spinner && (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <RollingLoaderImage
              width={16}
              height={16}
              style={styles.loaderAnimation}
            />
          </Animated.View>
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

export type ConditionalActivityIndicatorProps = {
  visible: boolean;
  delay?: number;
} & ActivityIndicatorProps;

export function ConditionalActivityIndicator({
  visible = false,
  delay = 100,
  ...props
}: ConditionalActivityIndicatorProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    setDelayPassed(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (visible) {
      timerRef.current = setTimeout(() => {
        timerRef.current = undefined;
        setDelayPassed(true);
      }, delay);
    }
  }, [visible, delay, timerRef, setDelayPassed]);

  const shouldShow = visible && delayPassed;
  if (!shouldShow) return <></>;
  return <ActivityIndicator {...props} />;
}

function useSpinnerAnimation(visible = true, period = 1000) {
  const spinValue = useRef(new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue.current, {
        toValue: 1,
        duration: period,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    //return () => animation.reset();
  }, [visible, period, spinValue]);

  return spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    top: 60,
    left: 0,
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderCapsule: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 38 / 2,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: colors["black-200"],
    justifyContent: "center",
    alignItems: "center",
  },
  loaderCapsuleActivity: {
    backgroundColor: "#C39904",
  },
  loaderCapsuleError: {
    backgroundColor: "#FF5C00",
  },
  loaderAnimation: {
    width: 16,
    height: 16,
  },
  label: {
    fontFamily: fonts["text"],
    fontWeight: "400",
    color: "#fff",
    marginHorizontal: 20,
    flexWrap: "nowrap",
  },
});
