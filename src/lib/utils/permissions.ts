import { check, PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { Platform } from 'react-native';

const PERMISSION_LOCATION =
  Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

const PERMISSION_LOCATION_BACKGROUND =
  Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION : PERMISSIONS.IOS.LOCATION_ALWAYS;

export async function checkLocationPermission(): Promise<boolean> {
  const status = await check(PERMISSION_LOCATION);
  return status === 'granted';
}

export async function requestLocationPermission() {
  const status = await requestMultiple([PERMISSION_LOCATION, PERMISSION_LOCATION_BACKGROUND]);
  return status[PERMISSION_LOCATION] === 'granted';
}
