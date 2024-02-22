import { useTheme } from "@react-navigation/native";
import * as AppleAuthentication from "expo-apple-authentication";
import { View, StyleSheet, Text } from "react-native";

export type AppleSigninButtonProps = {
  onPress?: () => void;
  onSignin?: (
    credential: AppleAuthentication.AppleAuthenticationCredential
  ) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
};

const noop = () => {};

export default function AppleSigninButton({
  onPress = noop,
  onSignin = noop,
  onCancel = noop,
  onError = noop,
}: AppleSigninButtonProps) {
  const { colors } = useTheme();
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={styles.button}
      onPress={async () => {
        try {
          onPress();
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          onSignin(credential);
        } catch (e) {
          if (e.code === "ERR_REQUEST_CANCELED") {
            onCancel();
          } else {
            onError(e);
          }
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    width: 220,
    marginVertical: 8
  },
});
