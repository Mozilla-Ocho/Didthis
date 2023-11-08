import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { styles as globalStyles, colors } from "../styles";
import AddButtonImage from "../assets/add-button.svg";
import useAppShellHost from "../lib/appShellHost";

export type BottomNavProps = {};

export default function BottomNav({}: BottomNavProps) {
  const appShellHost = useAppShellHost();
  const { state, messaging } = appShellHost;

  const onAddPress = () => {
    const links = state?.links;
    if (!links) return;
    appShellHost.navigateToPath(links.newPost);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <AddButtonImage width={54} height={54} />
      </TouchableOpacity>
    </View>
  );
}

export function ConditionalBottomNav() {
  const appShellHost = useAppShellHost();
  const { bottomNav } = appShellHost.state;
  if (!bottomNav?.show) return <></>;

  return <BottomNav />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#CAC7C1", // TODO: move to styles.ts
  },
  addButton: {
    marginTop: -25,
  },
});
