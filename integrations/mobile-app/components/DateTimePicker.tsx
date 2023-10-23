import { View, TouchableOpacity, StyleSheet, Text, useColorScheme } from "react-native";
import { Header } from "@react-navigation/elements";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export type DateTimePickerProps = {};

export default function DateTimePicker({}: DateTimePickerProps) {
  const colorScheme = useColorScheme();

  return (
    <RNDateTimePicker
      mode="datetime"
      display="inline"
      value={new Date()}
      style={styles.datePicker}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f00",
    flexDirection: "column",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  datePicker: {
    marginVertical: 12,
    marginHorizontal: 24,
  },
  header: {
    backgroundColor: "#ccc",
    flex: 1,
    flexGrow: 0,
    flexBasis: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  border: {
    borderBottomWidth: 1,
  },
});
