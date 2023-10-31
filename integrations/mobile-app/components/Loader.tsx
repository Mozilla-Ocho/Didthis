import {
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import LottieView from "lottie-react-native";

export type LoaderProps = {};

export default function Loader({}: LoaderProps) {
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        flexDirection: "column",
      }}
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
