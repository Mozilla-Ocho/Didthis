export type ApiUserId = string;
export type ApiPostId = string;
export type ApiProjectId = string;
export type ApiTimestamp = number; // epoch milliseconds integer
export type ApiProjectStatus = "active" | "complete" | "paused";
export type ApiScope = "public" | "private";

export type CapturedImage = {
  width: number;
  height: number;
  exif?: Record<string, any> | null;
  fileSize?: number;
  base64?: string | null;
  remoteUrl?: string | null;
}

export type ApiUrlMeta = {
  host: string;
  title: string;
  image?: CapturedImage;
};

export type ApiPost = {
  id: ApiPostId;
  projectId: ApiProjectId;
  createdAt: ApiTimestamp;
  didThisAt: ApiTimestamp;
  updatedAt: ApiTimestamp;
  scope: ApiScope;
  image?: CapturedImage;
  description?: string;
  linkUrl?: string;
  urlMeta?: ApiUrlMeta;
};

export type ApiProject = {
  id: ApiProjectId;
  createdAt: ApiTimestamp;
  updatedAt: ApiTimestamp;
  title: string;
  scope: ApiScope;
  currentStatus: ApiProjectStatus;
  posts: { [key: string]: ApiPost };
  description?: string;
  imageAssetId?: string;
  imageMeta?: CldImageMetaPrivate | CldImageMetaPublic;
};

// on publicly returned data for user image uploads, we restrict the image meta
// to these properties:
type CldImageMetaPublic = {
  metaOrigin: "filtered";
  width: number;
  height: number;
  format: string;
};
/* we're going to capture whatever object metadata cloudinary returns with
 * images, which includes things like the original dimensions, format, exif
 * metadat if any, etc */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type CldImageMetaPrivate = { [key: string]: any } & { metaOrigin: "private" };
// for imageMeta on link previews, metaOrigin is "urlMeta" and contains the
// whole payload but doesn't need to be filtered.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type CldImageMetaUrl = { [key: string]: any } & { metaOrigin: "urlMeta" };
type CldImageMetaAny =
  | CldImageMetaPublic
  | CldImageMetaPrivate
  | CldImageMetaUrl;
