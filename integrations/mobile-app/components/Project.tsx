import { ApiProject } from "../store/types";
import { View, FlatList } from "react-native";
import { styles } from "../styles";
import { Post } from "./Post";

export type ProjectProps = {
  project: ApiProject;
};

export const Project = ({ project }: ProjectProps) => {
  const posts = Object.values(project.posts);
  posts.sort((a, b) => a.didThisAt - b.didThisAt);

  return (
    <View style={styles.project}>
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => <Post post={item} />}
      />
    </View>
  );
};
