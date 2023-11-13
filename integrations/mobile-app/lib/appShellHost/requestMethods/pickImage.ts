import type { Methods } from "./index";
import * as ImagePicker from "expo-image-picker";
import { upload, UploadApiOptions } from "cloudinary-react-native";
// HACK: this is ugly, but seems not exported from elsewhere?
import {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";
import { Cloudinary } from "@cloudinary/url-gen";
import { AppRequestMethods, CldImageIntent, JSONObject } from "../types";

const baseCloudinaryConfig = {
  cloud: { cloudName: "dbpulyvbq" },
  url: { secure: true },
};

const baseUploadOptions = { unsigned: true };

const uploadOptions: Record<CldImageIntent, UploadApiOptions> = {
  avatar: {
    tags: ["avatar"],
    upload_preset: "avatar_uploads",
  },
  project: {
    tags: ["post"],
    upload_preset: "obyw5ywa",
  },
  post: {
    tags: ["project"],
    upload_preset: "wuty6ww4",
  },
};

export const pickImage: Methods["pickImage"] = async (api, payload) => {
  const { intent } = payload;

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: false,
    allowsEditing: true,
    quality: 1,
    base64: false,
    exif: true,
  });

  if (result.canceled) return { cancelled: true };

  const { uri, exif } = result.assets[0];

  // TODO: switch this to a more specific photo uploading status message
  // to web content, rather than global app loading?
  api.set("loading", true);

  // Weird mashup of promise and callback, but that seems to be the way
  // https://cloudinary.com/documentation/react_native_image_and_video_upload
  let uploadResponse: UploadApiResponse | undefined,
    uploadError: UploadApiErrorResponse | undefined;
  const cld = new Cloudinary({ ...baseCloudinaryConfig });
  await upload(cld, {
    file: uri,
    options: { ...baseUploadOptions, ...uploadOptions[intent] },
    callback: (error, response) => {
      uploadError = error;
      uploadResponse = response;
    },
  });

  api.set("loading", false);

  if (uploadError) {
    throw new Error(`Failed to upload image ${uploadError.message}`);
  }

  // TODO: perform some validation of uploadResponse?
  const {
    asset_id,
    created_at,
    format,
    image_metadata,
    resource_type,
    secure_url,
    url,
    width,
    height,
  } = uploadResponse;

  const response: AppRequestMethods["pickImage"]["response"] = {
    asset_id: asset_id as string,
    created_at,
    format,
    image_metadata: image_metadata as JSONObject,
    exif, // iOS exif differs a bit from cloudinary exif?
    resource_type,
    secure_url,
    url,
    width,
    height,
  };

  return response;
};

export default pickImage;
