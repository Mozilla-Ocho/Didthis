import {
  Header,
  HeaderBackButton,
  HeaderTitle,
} from "@react-navigation/elements";
import * as React from "react";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";

export type TopNavProps = {
  title?: string;
  leftIsBack?: boolean;
  leftLabel?: string;
  leftIsDisabled?: boolean;
  onLeftPress?: () => any;
  rightLabel?: string;
  rightIsDisabled?: boolean;
  onRightPress?: () => any;
};

const noop = () => {};

export default function TopNav({
  title,
  leftIsBack,
  leftIsDisabled,
  leftLabel,
  rightIsDisabled,
  rightLabel,
  onLeftPress,
  onRightPress,
}: TopNavProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        // HACK: figure out why this thing insists on inserting its own margin
        marginTop: -47,
      }}
    >
      <Header
        headerStyle={{
          backgroundColor: colors.background,
          borderBottomColor: colors.text,
        }}
        title={title}
        headerShadowVisible={true}
        headerLeft={() => (
          <HeaderSideButton
            {...{
              onPress: onLeftPress,
              isBack: leftIsBack,
              isDisabled: leftIsDisabled,
              label: leftLabel,
            }}
          />
        )}
        headerRight={() => (
          <HeaderSideButton
            {...{
              onPress: onRightPress,
              isDisabled: rightIsDisabled,
              label: rightLabel,
            }}
          />
        )}
      />
    </View>
  );
}

function HeaderSideButton({
  onPress,
  isBack,
  isDisabled,
  label,
}: {
  onPress: () => any;
  isBack?: boolean;
  isDisabled?: boolean;
  label: string;
}) {
  const { colors } = useTheme();
  let style = {
    fontWeight: undefined,
    fontSize: 17,
    letterSpacing: 0.35,
    opacity: isDisabled ? 0.3 : 1.0,
  };
  if (isBack) {
    return (
      <HeaderBackButton
        style={style}
        label={label || "Back"}
        onPress={onPress}
      />
    );
  } else if (label) {
    return (
      <HeaderTitle
        onPress={isDisabled ? noop : onPress}
        style={{ ...style, color: colors.primary, marginHorizontal: 22 }}
      >
        {label}
      </HeaderTitle>
    );
  }
}
