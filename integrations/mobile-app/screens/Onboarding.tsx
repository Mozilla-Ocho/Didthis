import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Image, ImageSource } from "expo-image";
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
  useNavigationState,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { colors, styles as globalStyles } from "../styles";
import { ReactNode } from "react";

export type RouteParams = {};

export type OnboardingScreenProps = {} & StackScreenProps<
  RootStackParamList,
  "Onboarding"
>;

type PageRouteParams = {};

type PageStackParamList = {
  Page1: PageRouteParams;
  Page2: PageRouteParams;
  Page3: PageRouteParams;
};

const PageStack = createNativeStackNavigator<PageStackParamList>();

export default function OnboardingScreen({
  navigation,
}: OnboardingScreenProps) {
  const completeOnboarding = () => {
    navigation.navigate("WebApp");
  };
  const navigationRef = useNavigationContainerRef<PageStackParamList>();
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={styles.screen.backgroundColor} />
      <NavigationContainer
        independent={true}
        ref={navigationRef}
        onReady={() => {
          navigationRef.navigate("Page1");
        }}
      >
        <PageStack.Navigator screenOptions={{ headerShown: false }}>
          <PageStack.Screen name="Page1">
            {(params) => (
              <OnboardingPage
                {...{ ...params, completeOnboarding }}
                title="Welcome aboard!"
                heroImageSource={require("../assets/onboarding-1.png")}
              >
                <Text style={styles.pageContentText}>
                  Didthis helps you keep track of all your hobby projects. It's
                  free to use and easy to get started.
                </Text>
              </OnboardingPage>
            )}
          </PageStack.Screen>
          <PageStack.Screen name="Page2">
            {(params) => (
              <OnboardingPage
                {...{ ...params, completeOnboarding }}
                title="Create projects"
                heroImageSource={require("../assets/onboarding-2.png")}
              >
                <Text style={styles.pageContentText}>
                  Didthis works for any hobby that you can think of. Just create
                  a new project in the app to get started.
                </Text>
              </OnboardingPage>
            )}
          </PageStack.Screen>
          <PageStack.Screen name="Page3">
            {(params) => (
              <OnboardingPage
                {...{ ...params, completeOnboarding }}
                title="Record your update"
                heroImageSource={require("../assets/onboarding-3.png")}
              >
                <Text style={styles.pageContentText}>
                  Once you've created a project, you can use the app to track
                  your progress by saving photos, notes, or links as you go.
                </Text>
              </OnboardingPage>
            )}
          </PageStack.Screen>
        </PageStack.Navigator>
        <OnboardingPaginator {...{ completeOnboarding }} />
      </NavigationContainer>
    </SafeAreaView>
  );
}

type OnboardingPageProps = {
  title: string;
  heroImageSource: ImageSource;
  completeOnboarding: () => void;
  children: ReactNode;
} & StackScreenProps<PageStackParamList, keyof PageStackParamList>;

function OnboardingPage({
  route,
  navigation,
  title,
  heroImageSource,
  completeOnboarding,
  children,
}: OnboardingPageProps) {
  const { name: currentRouteName } = route;
  const { index, routeNames } = navigation.getState();
  const canGoBack = navigation.canGoBack();
  const nextPage = routeNames[index + 1];

  return (
    <View style={styles.page}>
      <View style={styles.heroImageContainer}>
        <Image
          style={styles.heroImage}
          contentFit="cover"
          source={heroImageSource}
        />
      </View>
      <View style={styles.pageContent}>
        <Text style={styles.pageContentTitle}>{title}</Text>
        {children}
        <TouchableOpacity
          style={styles.pageNextButton}
          onPress={nextPage ? () => navigation.push(nextPage) : completeOnboarding}
        >
          <Text style={styles.pageNextButtonLabel}>
            {nextPage ? "Next" : "Use Didthis"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type OnboardingPaginatorProps = {
  completeOnboarding: () => void;
};

function OnboardingPaginator({ completeOnboarding }: OnboardingPaginatorProps) {
  const navigation = useNavigation();
  const { index = 0, routeNames = [] } =
    useNavigationState((state) => state) || {};
  return (
    <View style={styles.paginator}>
      <View style={styles.paginatorPages}>
        {routeNames.map((routeName, routeNameIndex) => (
          <View
            style={styles.paginatorPageIndicator}
            key={`page-indicator-${routeNameIndex}`}
          >
            <Image
              // TODO: switch to using an svg fill color here rather than separate assets
              source={
                routeNameIndex === index
                  ? require("../assets/ellipse-dot-active.svg")
                  : require("../assets/ellipse-dot.svg")
              }
              style={{ width: 12, height: 12 }}
            />
          </View>
        ))}
      </View>
      <View style={styles.paginatorPrevious}>
        {index > 0 && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.paginatorPreviousText}>Previous</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.paginatorSkip}>
        <TouchableOpacity onPress={completeOnboarding}>
          <Text style={styles.paginatorSkipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors["yellow-300"],
    flex: 1,
    flexDirection: "column",
    alignContent: "stretch",
  },
  page: {
    backgroundColor: colors["white"],
    flexDirection: "column",
  },
  heroImageContainer: {
    height: 405,
    backgroundColor: colors["yellow-300"],
  },
  heroImage: {
    height: 405,
  },
  pageContent: {
    backgroundColor: colors["white"],
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: "100%",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  pageContentTitle: {
    ...globalStyles.textHeading,
    marginVertical: 10,
  },
  pageContentText: {
    ...globalStyles.text,
  },
  pageNextButton: {
    padding: 15,
    marginVertical: 20,
    backgroundColor: colors["yellow-500"],
    borderRadius: 4,
    width: 140,
    flexDirection: "column",
  },
  pageNextButtonLabel: {
    ...globalStyles.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    alignSelf: "center",
  },
  paginator: {
    backgroundColor: colors["white"],
    padding: 10,
    flexDirection: "row",
    flexGrow: 0,
    justifyContent: "space-between",
  },
  paginatorPrevious: {
    position: "absolute",
    left: 0,
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  paginatorSkip: {
    position: "absolute",
    right: 0,
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  paginatorPreviousText: {
    ...globalStyles.text,
    ...globalStyles.textLink,
  },
  paginatorPages: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexGrow: 1,
  },
  paginatorPageIndicator: { margin: 6 },
  paginatorSkipText: {
    ...globalStyles.text,
    ...globalStyles.textLink,
  },
});
