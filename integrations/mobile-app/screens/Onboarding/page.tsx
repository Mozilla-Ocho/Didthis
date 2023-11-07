import { View, Text, TouchableOpacity } from "react-native";
import { Image, ImageSource } from "expo-image";
import { ReactNode, useContext } from "react";
import { styles } from "./styles";
import { PageStackParamList } from ".";
import { OnboardingScreenContext } from "./context";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type OnboardingPageProps = {
  title: string;
  heroImageSource: ImageSource;
  children: ReactNode;
};

export function OnboardingPage({
  title,
  heroImageSource,
  children,
}: OnboardingPageProps) {
  const navigation = useNavigation<NavigationProp<PageStackParamList>>();
  const { completeOnboarding } = useContext(OnboardingScreenContext);
  const { index, routeNames } = navigation.getState();
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
          onPress={
            nextPage ? () => navigation.navigate(nextPage) : completeOnboarding
          }
        >
          <Text style={styles.pageNextButtonLabel}>
            {nextPage ? "Next" : "Use Didthis"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
