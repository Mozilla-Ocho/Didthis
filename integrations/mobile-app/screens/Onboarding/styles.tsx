import { StyleSheet } from "react-native";
import { colors, styles as globalStyles } from "../../styles";

export const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors["white"],
    flex: 1,
    flexDirection: "column",
    alignContent: "stretch",
  },
  page: {
    backgroundColor: colors["white"],
    flexDirection: "column",
  },
  heroImageContainer: {
    height: 405,
    backgroundColor: colors["yellow-300"],
  },
  heroImage: {
    height: 405,
  },
  pageContent: {
    backgroundColor: colors["white"],
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: "100%",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  pageContentTitle: {
    ...globalStyles.textHeading,
    marginVertical: 10,
  },
  pageContentParagraph: {
    fontSize: 16,
    lineHeight: 23,
  },
  pageContentText: {
    ...globalStyles.text,
  },
  pageNextButton: {
    padding: 15,
    marginVertical: 20,
    backgroundColor: colors["yellow-500"],
    borderRadius: 4,
    width: 140,
    flexDirection: "column",
  },
  pageNextButtonLabel: {
    ...globalStyles.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    alignSelf: "center",
  },
  paginator: {
    backgroundColor: colors["white"],
    padding: 10,
    flexDirection: "row",
    flexGrow: 0,
    justifyContent: "space-between",
  },
  paginatorPrevious: {
    position: "absolute",
    left: 0,
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  paginatorSkip: {
    position: "absolute",
    right: 0,
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  paginatorPreviousText: {
    ...globalStyles.text,
    ...globalStyles.textLink,
  },
  paginatorPages: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexGrow: 1,
  },
  paginatorPageIndicator: { margin: 6 },
  paginatorSkipText: {
    ...globalStyles.text,
    ...globalStyles.textLink,
  },
});
