import { CapturedImage } from "../store/types";

// TODO: find a way to load this up dynamically?
export function makeDidThisImage(): CapturedImage {
  return {
    width: 359,
    height: 93,
    base64: `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`,
  };
}
