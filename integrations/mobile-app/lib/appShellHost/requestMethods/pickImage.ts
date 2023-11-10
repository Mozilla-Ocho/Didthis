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
  cloud: {
    cloudName: "dbpulyvbq",
  },
  url: {
    secure: true,
  },
};

const uploadConfigs: Record<CldImageIntent, UploadApiOptions> = {
  avatar: {
    tags: ["avatar"],
    upload_preset: "avatar_uploads",
  },
  project: {
    cropping: false,
    croppingAspectRatio: undefined,
    croppingCoordinatesMode: undefined,
    showSkipCropButton: undefined,
    tags: ["post"],
    upload_preset: "obyw5ywa",
    folder: "posts",
  },
  post: {
    tags: ["project"],
    croppingAspectRatio: 1.5,

    upload_preset: "wuty6ww4",
    folder: "projects",
  },
};

export const pickImage: Methods["pickImage"] = async (api, payload) => {
  const { intent } = payload;

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    exif: true,
    base64: false, //true,
    allowsMultipleSelection: false,
  });

  if (result.canceled) return { cancelled: true };

  const { uri } = result.assets[0];

  const cld = new Cloudinary({ ...baseCloudinaryConfig });

  // TODO: set a loading indicator during upload

  // Weird mashup of promise and callback, but that seems to be the way
  // https://cloudinary.com/documentation/react_native_image_and_video_upload
  let uploadResponse: UploadApiResponse | undefined,
    uploadError: UploadApiErrorResponse | undefined;
  await upload(cld, {
    file: uri,
    options: { ...uploadConfigs[intent], unsigned: true },
    callback: (error: UploadApiErrorResponse, response: UploadApiResponse) => {
      uploadResponse = response;
      console.debug("ERROR", error);
      console.debug("RESPONSE", response);
    },
  });

  // TODO: clear a loading indicator after upload

  if (uploadError) {
    throw new Error(`Failed to upload image ${uploadError.message}`);
  }

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

  // TODO: perform some validation of uploadResponse?

  const response: AppRequestMethods["pickImage"]["response"] = {
    asset_id: asset_id as string,
    created_at,
    format,
    image_metadata: image_metadata as JSONObject,
    resource_type,
    secure_url,
    url,
    width,
    height,
  };

  return response;
};

export default pickImage;
