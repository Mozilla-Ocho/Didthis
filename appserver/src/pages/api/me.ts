// a simple route to fetch the authenticated user's own user record.

import type { NextApiRequest, NextApiResponse } from "next";
// import { respond } from "@/lib/respond";
import type { MeWrapper } from "@/lib/apiConstants";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const wrapper:MeWrapper = {
    action: "authentication",
    status: 401,
    result: {
      success: false,
      errorId: "ERR_UNAUTHORIZED",
      errorMsg: "unauthorized",
    }
  }
  res.status(401).json(wrapper)
}

// authRoutes.get(
//   serverAppPaths.apiEndpoints.getMe,
//   requireAuth,
//   async (req, res) => {
//     // don't need to await this last_read_from_user column write, fire async.
//     // however, you need to attach a then() handler or knex doesn't know to
//     // actually trigger it.
//     const millis = new Date().getTime();
//     knex('users')
//       .update({
//         last_read_from_user: millis,
//         updated_at_millis: millis,
//       })
//       .where('id', req.authentication.userId).then(()=>{})
//     respond({
//       res,
//       action: 'me',
//       status: 200,
//       payload: {
//         user: userPOJOFromDbRow(req.authentication.userRow),
//       },
//     });
//   }
// );
