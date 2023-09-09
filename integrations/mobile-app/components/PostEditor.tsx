import React, { useState, useEffect, useReducer } from "react";
import { View, Text, Button, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { styles } from "../styles";
import { ApiPost } from "../store/types";

export type PostEditorProps = {
  post: ApiPost;
};

export const PostEditor = ({ post }: PostEditorProps) => {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [currentDescription, setCurrentDescription] = useState(
    post.description
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
    if (result.canceled) {
      return;
    }

    //setImage(result.assets[0].uri);
    setImage(result.assets[0]);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const onChangeDescription = (newValue) => {
    setCurrentDescription(newValue)
  };

  return (
    <>
      <View style={styles.post}>
        <Text>{post.id}</Text>
        <Text>{new Date(post.didThisAt).toLocaleDateString()}</Text>
        <Button onPress={showDatepicker} title="Show date picker!" />
        <Button onPress={showTimepicker} title="Show time picker!" />
        <Text>selected: {date.toLocaleString()}</Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <>
          <Image source={{ uri: 'data:image/jpeg;base64,' + image.base64 }} style={{ width: 200, height: 200 }} />
          <Text>{JSON.stringify(image.exif)}</Text>
        </>}
        <TextInput
          onChangeText={onChangeDescription}
          value={currentDescription}
          placeholder="post description"
          style={{ padding: 10, borderColor: "#000000", borderWidth: 2 }}
        />
        {post.description && <Text>{currentDescription}</Text>}
      </View>
    </>
  );
};
