import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { styles as globalStyles, colors } from "../styles";
import AddButtonImage from "../assets/add-button.svg";
import useAppShellHost from "../lib/appShellHost";
import Animated, {
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
  runOnJS,
} from "react-native-reanimated";
import { useState } from "react";

export type BottomNavProps = {};

export default function BottomNav({}: BottomNavProps) {
  // const appShellHost = useAppShellHost();
  // const { state, messaging } = appShellHost;
  const drawerPos = useSharedValue(0);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const damping = 13;
  const onAddPress = () => {
    drawerPos.value = withSpring(drawerPos.value + 300, { damping });
    setShowBackdrop(true);
  };
  const animDone = () => {
  };
  const onClose = () => {
    drawerPos.value = withSpring(0, { damping }, () => runOnJS(animDone)());
    setShowBackdrop(false);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <AddButtonImage width={54} height={54} />
        </TouchableOpacity>
      </View>
      {showBackdrop && (
        <Animated.View
          style={styles.overlay}
          entering={FadeIn}
          // exiting={FadeOut}
        >
          <TouchableOpacity
            style={styles.backdrop}
            onPress={onClose}
          ></TouchableOpacity>
        </Animated.View>
      )}
      <Animated.View
        style={{
          ...styles.drawer,
          height: drawerPos,
        }}
      ></Animated.View>
    </>
  );
}

export function ConditionalBottomNav() {
  const appShellHost = useAppShellHost();
  const { bottomNav } = appShellHost.state;
  if (!bottomNav?.show) return <></>;

  return <BottomNav />;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backdrop: {
    backgroundColor: "#000000",
    opacity: 0.5,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#CAC7C1", // TODO: move to styles.ts
  },
  drawer: {
    backgroundColor: "white",
    borderRadius: 30,
    position: "absolute",
    height: 0,
    left: 0,
    bottom: 0,
    right: 0,
    shadowOffset: {width:0,height:0},
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  addButton: {
    marginTop: -25,
  },
});
