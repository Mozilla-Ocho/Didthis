import { SafeAreaView, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { globalTheme } from "../styles";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import TopNav from "../components/TopNav";
import { useState } from "react";
import useAppShellHost from "../lib/appShellHost";

export type RouteParams = {
  requestId: string;
  title?: string;
  initialDateTime?: number;
};

export type DateTimePickerScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "DateTimePicker"
>;

export default function DateTimePickerScreen({
  navigation,
  route,
}: DateTimePickerScreenProps) {
  const {
    requestId,
    title = "Did this when?",
    initialDateTime = Date.now(),
  } = route.params || {};
  const api = useAppShellHost();
  const request = api.messaging.getDeferredResponse<"pickDateTime">(requestId);
  const scheme = "light"; // useColorScheme();

  const [currentDateTime, setDateTimeValue] = useState<Date>(
    new Date(initialDateTime)
  );
  const valueHasChanged = currentDateTime.getTime() !== initialDateTime;

  const sendResponse = (dateTime: number) => {
    request.resolve({ dateTime, changed: valueHasChanged });
    navigation.navigate("WebApp", {});
  };

  const handleOnCancel = () => sendResponse(initialDateTime);
  const handleOnConfirm = () => sendResponse(currentDateTime.getTime());

  const handleOnChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) setDateTimeValue(date);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TopNav
        title={title}
        leftLabel="Cancel"
        onLeftPress={handleOnCancel}
        rightLabel="Done"
        onRightPress={handleOnConfirm}
        rightIsDisabled={!valueHasChanged}
      />
      <RNDateTimePicker
        mode="datetime"
        display="inline"
        value={currentDateTime}
        style={styles.datePicker}
        themeVariant={scheme}
        onChange={handleOnChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: globalTheme.colors.background,
    flex: 1,
    flexDirection: "column",
    alignContent: "stretch",
  },
  datePicker: {
    marginVertical: 12,
    marginHorizontal: 24,
  },
});
