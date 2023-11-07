import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { styles } from "./styles";
import { colors } from "../../styles";
import { OnboardingScreenContext } from "./context";
import { useContext } from "react";
import IndicatorDotImage from "../../assets/ellipse-dot.svg";

export type OnboardingPaginatorProps = {};

export function OnboardingPaginator({}: OnboardingPaginatorProps) {
  const { completeOnboarding } = useContext(OnboardingScreenContext);
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
            <IndicatorDotImage
              width={12}
              height={12}
              fill={
                routeNameIndex === index
                  ? colors["yellow-500"]
                  : colors["charcoal-medium"]
              }
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
