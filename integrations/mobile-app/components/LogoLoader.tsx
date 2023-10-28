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
      style={{
        ...StyleSheet.absoluteFillObject,
        flexDirection: "column",
      }}
    >
      <LottieView
        style={{ flexGrow: 1 }}
        source={require("../assets/DidThis-LoaderAnim.json")}
        autoPlay={true}
        loop={true}
      />
    </SafeAreaView>
  );
}
