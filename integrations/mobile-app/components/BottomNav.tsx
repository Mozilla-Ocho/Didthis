import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles as globalStyles, colors } from "../styles";
import AddButtonImage from "../assets/add-button.svg";
import useAppShellHost from "../lib/appShellHost";
import Animated, {
  useSharedValue,
  withSpring,
  FadeIn,
  // FadeOut,
  runOnJS,
} from "react-native-reanimated";
import { useState } from "react";
import { Image } from "expo-image";
import { ApiProject } from "../lib/types";

export type BottomNavProps = {};

export default function BottomNav({}: BottomNavProps) {
  const appShellHost = useAppShellHost();
  const { state, messaging } = appShellHost;
  const gridSquareSize = 100;
  const drawerHeight = 400;
  const drawerHiddenY = -1 * drawerHeight - 50;
  const drawerPos = useSharedValue(drawerHiddenY);

  // drawerActive is the logical state of the drawer, but when it goes false,
  // it's still shown for the duration of the close animation.
  const [drawerActive, setDrawerActive] = useState(false);
  // renderDrawer is the UI boolean that is only false once the close animations
  // are done.
  const [renderDrawer, setRenderDrawer] = useState(false);

  const damping = 16;
  const onAddPress = () => {
    drawerPos.value = withSpring(0, { damping });
    setRenderDrawer(true);
    setDrawerActive(true);
  };
  const animDone = () => {
    if (!drawerActive) setRenderDrawer(false);
  };
  const onClose = () => {
    drawerPos.value = withSpring(drawerHiddenY, { damping }, () =>
      runOnJS(animDone)(),
    );
    setDrawerActive(false);
  };
  const onCreateProject = () => {
    // TODO: path construction logic is dependent on, and shared with, web app.
    const path =
      "/user/" + encodeURIComponent(state.user.publicPageSlug) + "/project/new";
    messaging.postMessage("navigateToPath", { path });
    onClose();
  };
  const onAddToProject = (project: ApiProject) => {
    // TODO: path construction logic is dependent on, and shared with, web app.
    const path =
      "/user/" +
      encodeURI(state.user.publicPageSlug) +
      "/post?projectId=" +
      encodeURIComponent(project.id);
    messaging.postMessage("navigateToPath", { path });
    onClose();
  };

  // TODO / BUG: this doesn't update right after a project is created. when
  // does it actually update? seems to update when topnav is used...
  const projects = Object.values(state.user ? state.user.profile.projects : {});
  projects.sort((a, b) => b.createdAt - a.createdAt);

  const projectImgUrl = (project: ApiProject) => {
    // TODO: cloudinary url construction, like other paths, is dependent and
    // shared w/ web app.
    const cloudinaryBase = `https://res.cloudinary.com/dbpulyvbq/image/upload/c_limit,h_2000,w_2000,f_jpg,q_auto/v1/`;
    if (project.imageAssetId) {
      return cloudinaryBase + project.imageAssetId;
    } else {
      return cloudinaryBase + "projects/owj4cttaiwevemryev8x";
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <AddButtonImage width={54} height={54} />
        </TouchableOpacity>
      </View>
      {drawerActive && (
        <Animated.View
          style={styles.overlay}
          entering={FadeIn}
          // exiting={FadeOut}
        >
          {/* FadeOut is disabled for now b/c it's rendering oddly in the notch area. */}
          <TouchableOpacity
            style={styles.backdrop}
            onPress={onClose}
          ></TouchableOpacity>
        </Animated.View>
      )}
      {renderDrawer && (
        <Animated.View
          style={{
            ...styles.drawer,
            height: drawerHeight,
            bottom: drawerPos,
            padding: 15,
          }}
        >
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Add update to which project?
          </Text>
          <ScrollView
            style={{
              paddingTop: 15,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <TouchableOpacity
                style={{ width: gridSquareSize }}
                onPress={onCreateProject}
              >
                <AddButtonImage
                  width={gridSquareSize}
                  height={gridSquareSize}
                />
                <Text style={{ marginTop: 5, textAlign: "center" }}>
                  Create project
                </Text>
              </TouchableOpacity>
              {projects.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={{ width: gridSquareSize }}
                  onPress={() => onAddToProject(project)}
                >
                  <Image
                    style={{
                      width: gridSquareSize,
                      height: gridSquareSize,
                      borderRadius: 15,
                    }}
                    contentFit="cover"
                    source={projectImgUrl(project)}
                  />
                  <Text style={{ marginTop: 5, textAlign: "center" }}>
                    {project.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </>
  );
}

export function ConditionalBottomNav() {
  const appShellHost = useAppShellHost();
  const { bottomNav } = appShellHost.state;
  if (!bottomNav?.show) return <></>;

  return <BottomNav />;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backdrop: {
    backgroundColor: "#000000",
    opacity: 0.5,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#CAC7C1", // TODO: move to styles.ts
  },
  drawer: {
    backgroundColor: "white",
    borderRadius: 30,
    position: "absolute",
    height: 0,
    left: 0,
    bottom: 0,
    right: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  addButton: {
    marginTop: -25,
  },
});
