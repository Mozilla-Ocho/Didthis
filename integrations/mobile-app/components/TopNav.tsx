import {
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

export type TopNavProps = {
  title?: string;
  leftIsBack?: boolean;
  leftLabel?: string;
  onLeftPress?: () => any;
  rightIsForward?: boolean;
  rightLabel?: string;
  onRightPress?: () => any;
};

export default function TopNav({
  title,
  leftIsBack,
  rightIsForward,
  leftLabel,
  rightLabel,
  onLeftPress,
  onRightPress,
}: TopNavProps) {
  const colorScheme = useColorScheme();
  const styles = colorScheme == "dark" ? darkStyles : lightStyles;

  return (
    <View style={styles.bar}>
      {title && <Text style={styles.title}>{title}</Text>}
      {onLeftPress && (
        <TouchableOpacity style={styles.leftButton} onPress={onLeftPress}>
            {leftIsBack && <FontAwesomeIcon icon={faChevronLeft} />}
          <Text style={[styles.buttonText, styles.leftButton]}>
            {leftLabel}
          </Text>
        </TouchableOpacity>
      )}
      {onRightPress && (
        <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
          <Text style={[styles.buttonText, styles.rightButton]}>
            {rightLabel}
          </Text>
          {rightIsForward && <FontAwesomeIcon icon={faChevronRight} />}
        </TouchableOpacity>
      )}
    </View>
  );
}

type Colors = {
  fg: string;
  fgMuted: string;
  bg: string;
};

const buildThemeStyles = (colors: Colors) =>
  StyleSheet.create({
    bar: {
      flexDirection: "row",
      borderBottomWidth: 2,
      justifyContent: "space-around",
      paddingVertical: 24,
      marginHorizontal: 0,
      borderColor: colors.fgMuted,
    },
    buttonText: {
      color: colors.fg,
      fontSize: 17,
    },
    buttonEnabled: {},
    buttonDisabled: {},
    leftButton: {
      flex: 1,
      flexDirection: "row",
      position: "absolute",
      paddingHorizontal: 12,
      left: 0,
      textAlign: "left",
      lineHeight: 48,
    },
    leftButtonText: {
      textAlign: "right",
      lineHeight: 48,
    },
    title: {
      position: "absolute",
      width: "100%",
      lineHeight: 48,
      left: 0,
      paddingHorizontal: 12,
      flexGrow: 1,
      textAlign: "center",
      fontSize: 17,
      fontWeight: "bold",
      color: colors.fg,
    },
    rightButton: {
      flex: 1,
      flexDirection: "row",
      position: "absolute",
      paddingHorizontal: 12,
      right: 0,
      lineHeight: 48,
      textAlign: "right",
    },
    rightButtonText: {
      textAlign: "right",
      lineHeight: 48,
    },
  });

const lightStyles = buildThemeStyles({
  bg: "rgba(255, 255, 255, 1)",
  fg: "rgba(0, 0, 0, 1.0)",
  fgMuted: "rgba(0, 0, 0, 0.3)",
});

const darkStyles = buildThemeStyles({
  bg: "rgba(0, 0, 0, 1)",
  fg: "rgba(255, 255, 255, 1.0)",
  fgMuted: "rgba(255, 255, 255, 0.3)",
});
