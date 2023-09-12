import React, { useState, useEffect, useReducer } from "react";
import { View, Text, Button, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { styles } from "../styles";
import { ApiPost } from "../store/types";
import { Post } from "./Post";

export type PostEditorProps = {
  post: ApiPost;
};

type State = {
  showDatePicker: boolean;
  post: ApiPost;
};

const createInitialState = (initialPost: ApiPost): State => ({
  showDatePicker: false,
  post: initialPost,
});

// TODO: "save" button to commit current state of reducer

export const PostEditor = ({ post: initialPost }: PostEditorProps) => {
  const [{ showDatePicker, post }, dispatch] = useReducer(
    reducer,
    initialPost,
    createInitialState
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      dispatch({
        type: "updatePost",
        key: "image",
        value: result.assets[0],
      });
    }
  };

  // TODO: always show on iOS, use imperative on android
  const showDatepicker = () => {
    dispatch({
      type: "showDatePicker",
      value: true,
    });
  };

  const onChangeDidThisAt = (_event, selectedDate: Date) => {
    dispatch([
      {
        type: "updatePost",
        key: "didThisAt",
        value: new Date(selectedDate).getTime(),
      },
      {
        type: "showDatePicker",
        value: false,
      },
    ]);
  };

  const onChangeDescription = (value: string) =>
    dispatch({ type: "updatePost", key: "description", value });

  return (
    <>
      <Post post={post} />

      <View style={styles.post}>
        <Button onPress={showDatepicker} title="Show date picker!" />
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(post.didThisAt)}
            mode="datetime"
            onChange={onChangeDidThisAt}
          />
        )}
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <TextInput
          onChangeText={onChangeDescription}
          defaultValue={post.description}
          value={post.description}
          placeholder="post description"
          style={{ padding: 10, borderColor: "#000000", borderWidth: 2 }}
        />
      </View>
    </>
  );
};

type ObjectUpdateAction<T extends string, C extends Object> = {
  [K in keyof C]: {
    type: T;
    key: K;
    value: C[K];
  };
}[keyof C];

type PropertyUpdateAction<T extends string, V> = {
  type: T;
  value: V;
};

type Action =
  | ObjectUpdateAction<"updatePost", ApiPost>
  | PropertyUpdateAction<"showDatePicker", boolean>;

function actionReducer(state: State, action: Action) {
  switch (action.type) {
    case "showDatePicker":
      return { ...state, showDatePicker: action.value };
    case "updatePost": {
      const { post } = state;
      const { key, value } = action;
      return { ...state, post: { ...post, [key]: value } };
    }
    default:
      return state;
  }
}

export function reducer(stateIn: State, actionsIn: Action | Action[]) {
  let state = stateIn;
  let actions = Array.isArray(actionsIn) ? actionsIn : [actionsIn];
  for (let action of actions) {
    state = actionReducer(state, action);
  }
  return state;
}
