import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { styles as globalStyles, colors } from "../styles";
import AddButtonImage from "../assets/add-button.svg";
import CreateProjectButtonImage from "../assets/create-project-square.svg";
import useAppShellHost from "../lib/appShellHost";
import Animated, {
  useSharedValue,
  withSpring,
  FadeIn,
  // FadeOut,
  runOnJS,
} from "react-native-reanimated";
import { useState, useEffect, useCallback } from "react";
import { Image } from "expo-image";
import { ApiProject } from "../lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type BottomNavProps = {};

// TODO: path construction logic is dependent on, and shared with, web app.

type VoidFn = () => void;

function CreateProjectSquare({ requestClose }: { requestClose: VoidFn }) {
  const appShellHost = useAppShellHost();
  const { state, messaging } = appShellHost;
  const onCreateProject = () => {
    const path =
      "/user/" + encodeURIComponent(state.user.publicPageSlug) + "/project/new";
    messaging.postMessage("trackNativeEvent", { event: 'tapDrawerCreateProject' });
    messaging.postMessage("navigateToPath", { path });
    requestClose();
  };
  return (
    <TouchableOpacity
      style={{ ...styles.projectSquare, height: "auto" }}
      onPress={onCreateProject}
    >
      <CreateProjectButtonImage
        width={styles.projectSquare.width}
        height={styles.projectSquare.height}
      />
      <Text style={styles.projectGridItemText}>Create project</Text>
    </TouchableOpacity>
  );
}

function ProjectSquare({
  project,
  requestClose,
  isViewingProject,
}: {
  project: ApiProject;
  requestClose: VoidFn;
  isViewingProject?: boolean;
}) {
  const appShellHost = useAppShellHost();
  const { state, messaging } = appShellHost;
  const onAddToProject = () => {
    const path =
      "/user/" +
      encodeURI(state.user.publicPageSlug) +
      "/post?projectId=" +
      encodeURIComponent(project.id);
    messaging.postMessage("trackNativeEvent", { event: 'tapDrawerProject' });
    messaging.postMessage("navigateToPath", { path });
    requestClose();
  };
  // TODO: cloudinary url construction, like other paths, is dependent and
  // shared w/ web app.
  const cloudinaryBase = `https://res.cloudinary.com/dbpulyvbq/image/upload/c_limit,h_2000,w_2000,f_jpg,q_auto/v1/`;
  let projectImgUrl = project.imageAssetId
    ? cloudinaryBase + project.imageAssetId
    : cloudinaryBase + "projects/owj4cttaiwevemryev8x";

  // highlighting the currently viewed project if any
  const textStyle = isViewingProject
    ? { ...styles.projectGridItemText, ...styles.currentProjectText }
    : styles.projectGridItemText;
  const outerStyle = isViewingProject ? styles.currentProjectOuter : {};
  return (
    <TouchableOpacity
      key={project.id}
      style={{ ...styles.projectSquare, height: "auto" }}
      onPress={onAddToProject}
    >
      <View style={outerStyle}>
        <Image
          style={styles.projectSquare}
          contentFit="cover"
          source={projectImgUrl}
        />
      </View>
      <Text style={textStyle}>{project.title}</Text>
    </TouchableOpacity>
  );
}

function ProjectDrawer({
  isOpen,
  requestClose,
}: {
  // isOpen is the logical state of the drawer, and turns on/off the overlay,
  // but the drawer is always rendered below the screen, animates up on true,
  // and animates down after this goes false.
  isOpen: boolean;
  // since this is a controlled component where the parent controls the
  // open/close state, we need a signal that it needs to close, like when a
  // user clicks a project and the navigation starts.
  requestClose: VoidFn;
}) {
  const appShellHost = useAppShellHost();
  const { state } = appShellHost;
  const insets = useSafeAreaInsets();

  const damping = 16;
  const drawerHiddenY = -1 * styles.drawer.height - 50;
  const drawerPos = useSharedValue(drawerHiddenY);
  const [renderDrawer, setRenderDrawer] = useState(false);
  const [doneClosing, setDoneClosing] = useState(false);

  const onCloseAnimDone = useCallback(() => {
    // the callback dance here is a bit weird:
    // - reanimated library runs on another thread so callbacks need to be wrapped in runOnJS
    // - we need to use useCallback so that the useEffect that registers the
    // callback doesn't fire every render
    // - useCallback can't really access current state values, so it sets a
    // secondary value to false and another useEffect monitors the combo of the
    // animation done signal and the isOpen state (so that if the user reopens
    // the drawer before the animation is done, we don't destroy the view.)
    setDoneClosing(false);
  }, [setDoneClosing]);

  useEffect(() => {
    if (isOpen) {
      drawerPos.value = withSpring(
        0 - insets.bottom - styles.drawer.borderRadius,
        { damping }
      );
      setRenderDrawer(true);
    } else {
      drawerPos.value = withSpring(drawerHiddenY, { damping }, () =>
        runOnJS(onCloseAnimDone)()
      );
    }
  }, [isOpen, onCloseAnimDone]);

  useEffect(() => {
    if (doneClosing && !isOpen) {
      setRenderDrawer(false);
    }
    if (doneClosing && isOpen) {
      setDoneClosing(false);
    }
  });

  let projects = Object.values(state.user ? state.user.profile.projects : {});
  projects.sort((a, b) => b.createdAt - a.createdAt);

  // // if the user is on a project page, move it first.
  const viewingProjectId = state.viewingProjectId;
  const viewingProject = viewingProjectId
    ? projects.find((x) => x.id === viewingProjectId)
    : false;
  if (viewingProjectId && viewingProject) {
    projects = projects.filter((x) => x.id !== viewingProjectId);
    projects.unshift(viewingProject);
  }

  return (
    <>
      {isOpen && (
        <Animated.View
          style={styles.backdropContainer}
          entering={FadeIn}
          // exiting={FadeOut}
        >
          {/* FadeOut is disabled for now b/c it's rendering oddly in the notch area. */}
          <TouchableOpacity
            style={styles.backdrop}
            onPress={requestClose}
          ></TouchableOpacity>
        </Animated.View>
      )}
      {renderDrawer && (
        <Animated.View
          style={{
            ...styles.drawer,
            bottom: drawerPos,
          }}
        >
          <Text style={styles.projectGridHeading}>
            Select project
          </Text>
          <ScrollView
            style={{
              padding: 15,
            }}
          >
            <View style={styles.projectGrid}>
              <CreateProjectSquare requestClose={requestClose} />
              {projects.map((project) => (
                <ProjectSquare
                  key={project.id}
                  project={project}
                  requestClose={requestClose}
                  isViewingProject={project.id === viewingProjectId}
                />
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </>
  );
}

export default function BottomNav({}: BottomNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { messaging } = useAppShellHost();
  const onAddPress = () => {
    messaging.postMessage("trackNativeEvent", { event: 'tapDrawerOpen' });
    setDrawerOpen(true);
  };
  const requestClose = () => {
    setDrawerOpen(false);
  };
  return (
    <>
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.addButton}
          underlayColor="#FFF1A6"
          onPress={onAddPress}
        >
          <AddButtonImage width={65} height={65} />
        </TouchableHighlight>
      </View>
      <ProjectDrawer isOpen={drawerOpen} requestClose={requestClose} />
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
  backdropContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backdrop: {
    backgroundColor: "#757470",
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
    shadowColor: "black",
    shadowOffset: { width: 0, height: -7 },
    shadowRadius: 5,
    shadowOpacity: 0.08,
    paddingBottom:6,
  },
  drawer: {
    backgroundColor: "white",
    borderRadius: 30,
    position: "absolute",
    paddingTop: 15,
    paddingBottom: 15,
    height: 400,
    left: 0,
    bottom: 0,
    right: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: .5,
    shadowRadius: 10,
  },
  projectGridHeading: {
    fontWeight: "600",
    color:"#757470",
    textAlign: "center",
    marginBottom: 5,
  },
  projectGridItemText: {
    marginTop: 5,
    textAlign: "center",
  },
  projectGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "space-evenly",
  },
  projectSquare: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  addButton: {
    marginTop: -25,
    borderRadius: 100,
    shadowOffset: { width: 0, height:1 },
    shadowOpacity: .2,
    shadowRadius: 3,
    backgroundColor: "#F4C005",
    borderWidth: 1,
    borderColor: "#FFD685",
  },
  currentProjectText: {
    fontWeight: "bold",
  },
  currentProjectOuter: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
  },
});
