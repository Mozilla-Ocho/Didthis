import type { Methods } from "./index";
import { Share } from "react-native";

export const shareUrl: Methods["shareProjectUrl"] = async (
  api,
  payload,
  id
) => {
  const { url, title } = payload;
  // See: https://reactnative.dev/docs/share
  await Share.share({
    message: `Check out this project of mine on DidThis!\n\n${title}: ${url}`,
  });
  return { success: true };
};

export default shareUrl;
