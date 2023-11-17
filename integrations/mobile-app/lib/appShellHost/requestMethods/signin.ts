import type { Methods } from "./index";
import * as SiteAPI from "../../siteApi";

export const Signin: Methods["signin"] = async (api) => {
  await SiteAPI.resetSignin();
  api.navigation.reset({
    index: 0,
    routes: [{ name: "Signin" }],
  });
  api.reset();
  return { success: true };
};

export default Signin;
