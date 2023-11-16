import type { Methods } from "./index";
import type { DeferredResponses } from "../messaging";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { upload, UploadApiOptions } from "cloudinary-react-native";
// HACK: this is ugly, but seems not exported from elsewhere?
import {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";
import { Cloudinary } from "@cloudinary/url-gen";
import { AppRequestMethods, CldImageIntent, JSONObject } from "../types";
import AppShellHostAPI from "../api";

const baseCloudinaryConfig = {
  cloud: { cloudName: "dbpulyvbq" },
  url: { secure: true },
};

const baseUploadOptions: UploadApiOptions = {
  unsigned: true,
};

const uploadOptions: Record<CldImageIntent, UploadApiOptions> = {
  avatar: {
    tags: ["avatar"],
    upload_preset: "avatar_uploads",
  },
  post: {
    tags: ["post"],
    upload_preset: "obyw5ywa",
  },
  project: {
    tags: ["project"],
    upload_preset: "ewriamfm", // trying to force an aspect radio 1.5 transform on upload
    // upload_preset: "wuty6ww4", // same as web content
  },
};

const commonImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsMultipleSelection: false,
  allowsEditing: true,
  quality: 1,
  base64: false,
  exif: true,
};

export const pickImage: Methods["pickImage"] = async (api, payload, id) => {
  const { intent } = payload;
  const response = api.messaging.deferResponse<"pickImage">(id);
  const deferredResponse = api.messaging.getDeferredResponse<"pickImage">(id);
  Alert.alert("Upload an image from...", null, [
    {
      text: "Photo Library",
      onPress: () => pickFromLibrary(api, deferredResponse, intent),
    },
    {
      text: "Camera",
      onPress: () => pickFromCamera(api, deferredResponse, intent),
    },
    { text: "Cancel", style: "cancel" },
  ]);
  return response;
};

async function pickFromCamera(
  api: AppShellHostAPI,
  deferredResponse: DeferredResponses["pickImage"],
  intent: string
) {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) {
    Alert.alert(
      "Device settings alert",
      "Camera permission is required to upload an image"
    );
    return deferredResponse.resolve({ cancelled: true });
  }

  const result = await ImagePicker.launchCameraAsync(commonImagePickerOptions);
  if (result.canceled) return deferredResponse.resolve({ cancelled: true });

  return handleImagePickerResult(api, deferredResponse, intent, result);
}

async function pickFromLibrary(
  api: AppShellHostAPI,
  deferredResponse: DeferredResponses["pickImage"],
  intent: string
) {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) {
    Alert.alert(
      "Device settings alert",
      "Media library permission is required to upload an image"
    );
    return deferredResponse.resolve({ cancelled: true });
  }

  const result = await ImagePicker.launchImageLibraryAsync(
    commonImagePickerOptions
  );
  if (result.canceled) return deferredResponse.resolve({ cancelled: true });

  return handleImagePickerResult(api, deferredResponse, intent, result);
}

async function handleImagePickerResult(
  api: AppShellHostAPI,
  deferredResponse: DeferredResponses["pickImage"],
  intent: string,
  result: ImagePicker.ImagePickerResult
) {
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
    console.error("upload error", uploadError);
    deferredResponse.reject(
      new Error(`Failed to upload image ${uploadError.message}`)
    );
  }

  // TODO: perform some validation of uploadResponse?
  const {
    asset_id,
    public_id,
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
    public_id,
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

  return deferredResponse.resolve(response);
}

export default pickImage;
