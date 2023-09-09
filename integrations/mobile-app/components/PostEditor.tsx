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

type PostEditorReducerAction =
  | {
      type: "didThisAt";
      value: ApiPost["didThisAt"];
    }
  | {
      type: "description";
      value: ApiPost["description"];
    }
  | {
      type: "image";
      value: ApiPost["image"];
    };

export function postEditorReducer(
  state: ApiPost,
  action: PostEditorReducerAction
) {
  switch (action.type) {
    case "didThisAt":
      return { ...state, didThisAt: action.value };
    case "description":
      return { ...state, description: action.value };
    case "image":
      return { ...state, image: action.value };
    default: {
      return state;
    }
  }
}

export const PostEditor = ({ post: initialPost }: PostEditorProps) => {
  const [post, dispatch] = useReducer(postEditorReducer, initialPost);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      dispatch({ type: "image", value: result.assets[0] });
    }
  };

  const onChangeDidThisAt = (_event, selectedDate: Date) => {
    setShowDatePicker(false);
    dispatch({ type: "didThisAt", value: new Date(selectedDate).getTime() });
  };

  const onChangeDescription = (value: string) =>
    dispatch({ type: "description", value });

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

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
