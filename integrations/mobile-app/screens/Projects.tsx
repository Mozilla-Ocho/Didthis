import * as React from "react";
import { Button, View, Text } from "react-native";
import type { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type ProjectsScreenRouteParams = {
  now: number;
  thingy: string;
};

export type ProjectsScreenProps = {} & NativeStackScreenProps<
  RootStackParamList,
  "Projects"
>;

export default function ProjectsScreen(props: ProjectsScreenProps) {
  const { navigation, route } = props;
  const { now, thingy } = route.params;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Projects Screen: {now} - {thingy} - {JSON.stringify(props)}</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
