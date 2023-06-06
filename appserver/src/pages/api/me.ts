import type { NextApiRequest, NextApiResponse } from "next";
import type { MeWrapper, ErrorWrapper } from "@/lib/apiConstants";
import { getAuthUser } from "@/lib/serverAuth";
import knex from "@/knex";

// the main route used by the SPA to fetch the authenticated user's own user
// record and also asserts an authenticated session is active for the client.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getAuthUser(req, res);
  if (user) {
    const millis = new Date().getTime();
    // don't need to await this last_read_from_user column write, fire async.
    // however, you need to attach a then() handler or knex doesn't know to
    // actually trigger it.
    knex("users")
      .update({
        last_read_from_user: millis,
        updated_at_millis: millis,
      })
      .where("id", user.id)
      .then(() => {});
    user.updatedAt = millis
    const wrapper: MeWrapper = {
      action: "authentication",
      status: 200,
      success: true,
      payload: user,
    };
    res.status(200).json(wrapper);
  } else {
    const wrapper: ErrorWrapper = {
      action: "authentication",
      status: 401,
      success: false,
      errorId: "ERR_UNAUTHORIZED",
      errorMsg: "unauthorized",
    };
    res.status(401).json(wrapper);
  }
}
