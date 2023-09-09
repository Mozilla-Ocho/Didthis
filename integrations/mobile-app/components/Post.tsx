import { ApiPost } from "../store/types";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { styles } from "../styles";

export type PostProps = {
  post: ApiPost;
};

export const Post = ({ post }: PostProps) => {
  return (
    <>
      <View style={styles.post}>
        <Text>{post.id}</Text>
        <Text>{new Date(post.didThisAt).toLocaleDateString()}</Text>
        {post.image && post.image.base64 && (
          <Image
            style={{...styles.postImage, width: 200, height: 200 }}
            contentFit="contain"
            contentPosition="top"
            source={{ uri: "data:image/jpeg;base64," + post.image.base64 }}
          />
        )}
        {post.description && <Text>{post.description}</Text>}
      </View>
    </>
  );
};
