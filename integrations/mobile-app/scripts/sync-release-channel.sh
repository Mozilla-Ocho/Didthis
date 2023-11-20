#!/usr/bin/env bash
# Hacky utility to set expo update channel for native app build after expo prebuild
# see: https://github.com/expo/expo/issues/8318

APP_NAME="Didthis"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."

EXPO_PLIST="ios/${APP_NAME}/Supporting/Expo.plist"
RESULT=$(/usr/libexec/PlistBuddy -c "ADD EXUpdatesReleaseChannel string $1" ${PROJECT_DIR}/${EXPO_PLIST} 2>&1)
if [ $? -eq 0 ]; then
  echo "Added EXUpdatesReleaseChannel to ${EXPO_PLIST} to $1"
else
  if [ $? -ne 0 ] && [[ $RESULT == *"Entry Already Exists"* ]]; then
    RESULT=$(/usr/libexec/PlistBuddy -c "SET EXUpdatesReleaseChannel $1" ${PROJECT_DIR}/${EXPO_PLIST} 2>&1)
  fi
  if [ $? -eq 0 ]; then
    echo "Updated EXUpdatesReleaseChannel to ${EXPO_PLIST} to $1"
  else
    echo "Error occurred: ${RESULT}"
  fi
fi

# TODO: uncomment the below when someday we support android
#ANDROID_MANIFEST="android/app/src/main/AndroidManifest.xml"
#RESULT=$(sed -i '' 's/expo.modules.updates.EXPO_RELEASE_CHANNEL\" android:value=".*"/expo.modules.updates.EXPO_RELEASE_CHANNEL\" android:value="'$1'"/' ${PROJECT_DIR}/${ANDROID_MANIFEST} 2>&1)
#if [ $? -eq 0 ]; then
#  echo "Updated EXPO_RELEASE_CHANNEL in $ANDROID_MANIFEST to $1"
#else
#  echo "Error occurred: ${RESULT}"
#fi
