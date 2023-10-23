import {
  Header,
  HeaderBackButton,
  HeaderTitle,
} from "@react-navigation/elements";
import * as React from "react";
import { useTheme } from "@react-navigation/native";

export type TopNavProps = {
  title?: string;
  leftIsBack?: boolean;
  leftLabel?: string;
  onLeftPress?: () => any;
  rightLabel?: string;
  onRightPress?: () => any;
};

const noop = () => {};

export default function TopNav({
  title,
  leftIsBack,
  leftLabel,
  rightLabel,
  onLeftPress,
  onRightPress,
}: TopNavProps) {
  const { colors } = useTheme();

  return (
    <Header
      title={title}
      headerShadowVisible={true}
      headerLeft={() => (
        <HeaderSideButton
          {...{ onPress: onLeftPress, isBack: leftIsBack, label: leftLabel }}
        />
      )}
      headerRight={() => (
        <HeaderSideButton {...{ onPress: onRightPress, label: rightLabel }} />
      )}
    />
  );
}

function HeaderSideButton({
  onPress,
  isBack,
  label,
}: {
  onPress: () => any;
  isBack?: boolean;
  label: string;
}) {
  const { colors } = useTheme();
  let isDisabled = !onPress;
  let style = {
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
