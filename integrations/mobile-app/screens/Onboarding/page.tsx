import { View, Text, TouchableOpacity } from "react-native";
import { Image, ImageSource } from "expo-image";
import { ReactNode, useContext } from "react";
import { styles } from "./styles";
import { PageStackParamList } from ".";
import { OnboardingScreenContext } from "./context";
import {
  NavigationProp,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";

type OnboardingPageProps = {
  title: string;
  heroImageSource: ImageSource;
  children: ReactNode;
  lastPage?: boolean;
};

export function OnboardingPage({
  title,
  heroImageSource,
  children,
  lastPage,
}: OnboardingPageProps) {
  const { completeOnboarding } = useContext(OnboardingScreenContext);
  const navigation = useNavigation<NavigationProp<PageStackParamList>>();
  const nextPage = useNavigationState<
    PageStackParamList,
    keyof PageStackParamList | undefined
  >(({ index, routeNames }) => routeNames[index + 1]);

  const nextLabel = !lastPage ? "Next" : "Use Didthis";
  const onNextPress = !lastPage
    ? () => navigation.navigate(nextPage)
    : completeOnboarding;

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
        <Text style={styles.pageContentParagraph}>{children}</Text>
        <TouchableOpacity style={styles.pageNextButton} onPress={onNextPress}>
          <Text style={styles.pageNextButtonLabel}>{nextLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
