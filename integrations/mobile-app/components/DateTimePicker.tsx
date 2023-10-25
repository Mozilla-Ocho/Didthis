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
  const { colors } = useTheme();
  const scheme = useColorScheme();

  const styles = StyleSheet.create({
    datePicker: {
      marginVertical: 12,
      marginHorizontal: 24,
    },
  });

  return <>
    <RNDateTimePicker
      mode="datetime"
      display="inline"
      value={new Date()}
      style={styles.datePicker}
      themeVariant={scheme}
    />
  </>;
}
