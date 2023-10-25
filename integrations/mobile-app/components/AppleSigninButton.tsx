import { useTheme } from "@react-navigation/native";
import * as AppleAuthentication from "expo-apple-authentication";
import { View, StyleSheet, Text } from "react-native";

export type AppleSigninButtonProps = {
  onPress?: () => void,
  onSignin?: (credential: AppleAuthentication.AppleAuthenticationCredential) => void;
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
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: "center",
  },
  button: {
    height: 50,
    width: "75%",
    margin: 10,
    text: "#fff",
  },
});
