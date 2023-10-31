import AsyncStorage from "@react-native-async-storage/async-storage";

export type StorageKey =
  | "APPLE_ID_CREDENTIAL"
  | "AUTH_SESSION_COOKIE"
  | "SIGNED_IN_USER";

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
