import { PermissionsAndroid, Platform } from "react-native";

export const askStoragePermission = async () => {
  if (Platform.OS === "android") {
    if (Platform.Version >= 33) {
      // Android 13+
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // Android 12 and below
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true;
};
