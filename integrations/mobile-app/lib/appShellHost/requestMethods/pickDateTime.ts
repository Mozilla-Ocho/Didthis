import type { Methods } from "./index";

export const pickDateTime: Methods["pickDateTime"] = async (
  api,
  payload,
  id
) => {
  const { title, initialDateTime } = payload;
  const response = api.messaging.deferResponse<"pickDateTime">(id);
  api.navigation.navigate("DateTimePicker", {
    requestId: id,
    title,
    initialDateTime,
  });
  return response;
};

export default pickDateTime;
