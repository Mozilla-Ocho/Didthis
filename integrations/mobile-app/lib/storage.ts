import AsyncStorage from "@react-native-async-storage/async-storage";

export type StorageKey =
  | "APPLE_ID_CREDENTIAL"
  | "AUTH_SESSION_COOKIE"
  | "SIGNED_IN_USER"
  | "ONBOARDING_COMPLETED";

// TODO: implement specific accessor functions for known storage keys?

export async function setItem(key: StorageKey, value: string) {
  return AsyncStorage.setItem(key, value);
}

export async function setObject(key: StorageKey, object: object) {
  const value = JSON.stringify(object, null, "  ");
  return setItem(key, value);
}

export async function getItem(key: StorageKey) {
  return AsyncStorage.getItem(key);
}

export async function getObject(key: StorageKey) {
  const value = await getItem(key);
  return value ? JSON.parse(value) : value;
}

export async function removeItem(key: StorageKey) {
  return AsyncStorage.removeItem(key);
}

// Use a changeable string rather than boolean, in case we ever want to
// trigger re-onboarding in a future build
const ONBOARDING_COMPLETE_VALUE = "onboarding-completed-1";

export async function checkOnboarding() {
  const value = await getItem("ONBOARDING_COMPLETED");
  return value === ONBOARDING_COMPLETE_VALUE;
}

export async function setOnboardingComplete() {
  await setItem("ONBOARDING_COMPLETED", ONBOARDING_COMPLETE_VALUE);
}

export async function resetOnboardingComplete() {
  await removeItem("ONBOARDING_COMPLETED");
}
