import type { Methods } from "./index";

export const ShowAppInfo: Methods["showAppInfo"] = async (api) => {
  api.navigation.navigate("AppInfo");
  return { success: true };
};

export default ShowAppInfo;
