import { Text, SafeAreaView, Button, StatusBar } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as AppleAuthentication from "expo-apple-authentication";
import { RootStackParamList } from "../../App";
import * as Storage from "../../lib/storage";
import { styles } from "./styles";
import { OnboardingPaginator } from "./paginator";
import { OnboardingPage } from "./page";
import {
  OnboardingScreenContext,
  OnboardingScreenContextValue,
} from "./context";

export type RouteParams = {
  credential?: AppleAuthentication.AppleAuthenticationCredential;
};

export type OnboardingScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "Onboarding"
>;

export type PageStackParamList = {
  Page1: {};
  Page2: {};
  Page3: {};
};

const PageStack = createNativeStackNavigator<PageStackParamList>();

export default function OnboardingScreen({
  navigation,
  route,
}: OnboardingScreenProps) {
  const { credential } = route.params || {};

  const context: OnboardingScreenContextValue = {
    completeOnboarding: async () => {
      await Storage.setItem("ONBOARDING_COMPLETED", "true");
      navigation.navigate("WebApp", { credential });
    },
  };

  const onboardingNavigationRef =
    useNavigationContainerRef<PageStackParamList>();
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={styles.screen.backgroundColor} />
      <OnboardingScreenContext.Provider value={context}>
        <NavigationContainer
          independent={true}
          ref={onboardingNavigationRef}
          onReady={() => onboardingNavigationRef.navigate("Page1")}
        >
          <PageStack.Navigator screenOptions={{ headerShown: false }}>
            <PageStack.Screen name="Page1" component={OnboardingPage1} />
            <PageStack.Screen name="Page2" component={OnboardingPage2} />
            <PageStack.Screen name="Page3" component={OnboardingPage3} />
          </PageStack.Navigator>
          <OnboardingPaginator />
        </NavigationContainer>
      </OnboardingScreenContext.Provider>
    </SafeAreaView>
  );
}

type OnboardingPage1Props = {} & StackScreenProps<PageStackParamList, "Page1">;
function OnboardingPage1(params: OnboardingPage1Props) {
  return (
    <OnboardingPage
      title="Welcome aboard!"
      heroImageSource={require("../../assets/onboarding-1.png")}
    >
      <Text style={styles.pageContentText}>
        Didthis helps you keep track of all your hobby projects. It's free to
        use and easy to get started.
      </Text>
    </OnboardingPage>
  );
}

type OnboardingPage2Props = {} & StackScreenProps<PageStackParamList, "Page2">;
function OnboardingPage2(params: OnboardingPage2Props) {
  return (
    <OnboardingPage
      title="Create projects"
      heroImageSource={require("../../assets/onboarding-2.png")}
    >
      <Text style={styles.pageContentText}>
        Didthis works for any hobby that you can think of. Just create a new
        project in the app to get started.
      </Text>
    </OnboardingPage>
  );
}

type OnboardingPage3Props = {} & StackScreenProps<PageStackParamList, "Page3">;
function OnboardingPage3(params: OnboardingPage3Props) {
  return (
    <OnboardingPage
      title="Record your update"
      heroImageSource={require("../../assets/onboarding-3.png")}
    >
      <Text style={styles.pageContentText}>
        Once you've created a project, you can use the app to track your
        progress by saving photos, notes, or links as you go.
      </Text>
    </OnboardingPage>
  );
}
