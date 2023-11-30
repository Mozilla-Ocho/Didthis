import {
  Header,
  HeaderBackButton,
  PlatformPressable,
} from "@react-navigation/elements";
import * as React from "react";
import { useTheme } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Platform,
  GestureResponderEvent,
} from "react-native";
import ShareIcon from "../assets/share.svg";
import EditIcon from "../assets/edit.svg";
import { SvgProps } from "react-native-svg";
import useAppShellHost from "../lib/appShellHost";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TopNavProps = {
  title?: string;
  leftIsBack?: boolean;
  leftLabel?: string;
  leftIsDisabled?: boolean;
  rightLabel?: string;
  rightIsDisabled?: boolean;
  showShare?: boolean;
  shareIsDisabled?: boolean;
  showEdit?: boolean;
  editIsDisabled?: boolean;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onSharePress?: () => void;
  onEditPress?: () => void;
};

const noop = () => {};

export default function TopNav({
  title,
  leftIsBack,
  leftIsDisabled,
  leftLabel,
  rightIsDisabled,
  rightLabel,
  showShare,
  shareIsDisabled,
  showEdit,
  editIsDisabled,
  onLeftPress = noop,
  onRightPress = noop,
  onSharePress = noop,
  onEditPress = noop,
}: TopNavProps) {
  const { colors } = useTheme();

  return (
    <Header
      headerStyle={{
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: "#0000001D",
      }}
      title={title}
      headerShadowVisible={true}
      headerLeft={() => (
        <HeaderSideButton
          {...{
            onPress: onLeftPress,
            isBack: leftIsBack,
            isLeft: true,
            disabled: leftIsDisabled,
            label: leftLabel,
          }}
        />
      )}
      headerRight={() => (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {showShare && (
            <IconButton
              icon={ShareIcon}
              accessibilityLabel="Share"
              disabled={shareIsDisabled}
              color={colors.primary}
              onPress={onSharePress}
            />
          )}
          {showEdit && (
            <IconButton
              icon={EditIcon}
              accessibilityLabel="Edit"
              disabled={editIsDisabled}
              color={colors.primary}
              onPress={onEditPress}
            />
          )}
          <HeaderSideButton
            {...{
              onPress: onRightPress,
              disabled: rightIsDisabled,
              label: rightLabel,
            }}
          />
        </View>
      )}
    />
  );
}

function IconButton({
  icon: Icon,
  accessibilityLabel,
  onPress,
  disabled = false,
  color = "#fff",
}: {
  icon: React.FC<SvgProps>;
  accessibilityLabel: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled: boolean;
  color?: string;
}) {
  const styles = StyleSheet.create({
    container: {
      marginLeft: 2,
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    disabled: {
      opacity: 0.3,
    },
    icon: {},
  });
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <PlatformPressable
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        onPress={disabled ? noop : onPress}
        hitSlop={Platform.select({
          ios: undefined,
          default: { top: 16, right: 16, bottom: 16, left: 16 },
        })}
      >
        <Icon
          width={24}
          height={24}
          stroke={color}
          strokeWidth={1.5}
          style={styles.icon}
        />
      </PlatformPressable>
    </View>
  );
}

function HeaderSideButton({
  onPress,
  isBack = false,
  isLeft = false,
  disabled = false,
  label,
}: {
  onPress: () => any;
  isBack?: boolean;
  isLeft?: boolean;
  disabled?: boolean;
  label: string;
}) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    base: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      minWidth: 100,
      justifyContent: "flex-end",
    },
    baseLeft: {
      justifyContent: "flex-start",
    },
    baseBack: {
      minWidth: 100,
    },
    disabled: {
      opacity: 0.3,
    },
  });
  const hasLabel = typeof label !== "undefined";
  if (isBack) {
    return (
      <HeaderBackButton
        style={[styles.baseBack, disabled && styles.disabled]}
        tintColor={colors.primary}
        label={hasLabel ? label : "Back"}
        onPress={disabled ? noop : onPress}
      />
    );
  } else if (label) {
    // HACK: HeaderBackButton has a lot of good features and there doesn't
    // seem to be a plain old HeaderButton that offers all the same stuff 🤷‍♂️
    return (
      <HeaderBackButton
        backImage={() => ""}
        style={[
          styles.base,
          isLeft && styles.baseLeft,
          disabled && styles.disabled,
        ]}
        tintColor={colors.primary}
        label={label}
        onPress={disabled ? noop : onPress}
      />
    );
  }
}

export function ConditionalTopNav() {
  const appShellHost = useAppShellHost();
  const { messaging } = appShellHost;
  const insets = useSafeAreaInsets();

  const { topNav } = appShellHost.state;
  if (!topNav?.show) {
    // TopNav takes care of top safe inset, so container view doesn't. But,
    // if TopNav is not rendered, we still need to render that margin.
    return <View style={{ height: insets.top }}></View>;
  }

  const onLeftPress = () =>
    messaging.postMessage("topNavLeftPress", { label: topNav.leftLabel });
  const onRightPress = () =>
    messaging.postMessage("topNavRightPress", { label: topNav.rightLabel });
  const onSharePress = () =>
    messaging.postMessage("topNavSharePress", { label: "Share" });
  const onEditPress = () =>
    messaging.postMessage("topNavEditPress", { label: "Edit" });

  return (
    <TopNav
      {...{
        ...topNav,
        onLeftPress,
        onRightPress,
        onSharePress,
        onEditPress,
      }}
    />
  );
}
