import {
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import LottieView from "lottie-react-native";

export type LogoLoaderProps = {};

export default function LogoLoader({}: LogoLoaderProps) {
  return (
    <SafeAreaView
      style={styles.container}
    >
      <LottieView
        style={styles.loaderAnimation}
        source={require("../assets/DidThis-LoaderAnim.json")}
        autoPlay={true}
        loop={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    justifyContent: "center",
  },
  loaderAnimation: {
    width: 150,
    height: 150,
    alignSelf: "center",
    // flexGrow: 1
  }
})