import { getApplicationName } from 'react-native-device-info';
import { Alert } from 'react-native';

export function showAlertDialog(
  message: string,
  options?: {
    title?: string;
    positiveButtonText?: string;
    onPositiveButtonPress?: () => void;
  },
) {
  Alert.alert(options?.title ?? getApplicationName(), message, [
    {
      style: 'default',
      text: options?.positiveButtonText ?? 'Ok',
      onPress: () => {
        options?.onPositiveButtonPress?.();
      },
    },
  ]);
}
