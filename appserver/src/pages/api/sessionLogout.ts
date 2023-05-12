import type { NextApiRequest, NextApiResponse } from "next";
import type { EmptySuccessWrapper } from "@/lib/apiConstants";
import Cookies from "cookies";
import * as constants from "@/lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res, {
    // explicitly tell cookies lib whether to use secure cookies, rather
    // than having it inspect the request, which won't work due to
    // x-forwarded-proto being the real value.
    secure: process.env.NEXT_PUBLIC_ENV_NAME !== "dev",
  });
  cookies.set(constants.sessionCookieName); // set w/ no value to delete
  const wrapper: EmptySuccessWrapper = {
    action: "sessionLogout",
    status: 200,
    success: true,
  };
  res.status(200).json(wrapper);
}
