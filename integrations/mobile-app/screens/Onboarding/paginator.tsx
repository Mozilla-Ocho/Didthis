import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { colors } from "../../styles";
import { OnboardingScreenContext } from "./context";
import { useContext } from "react";
import IndicatorDotImage from "../../assets/ellipse-dot.svg";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

export type OnboardingPaginatorProps = {};

export function OnboardingPaginator({
  state,
  navigation,
}: MaterialTopTabBarProps) {
  const { completeOnboarding } = useContext(OnboardingScreenContext);
  const { routeNames = [], index = 0 } = state || {};
  const prevPage = index > 0 ? routeNames[index - 1] : null;

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
          <TouchableOpacity onPress={() => navigation.navigate(prevPage)}>
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
