import { NotificareUserPreference } from './lib/notificare/models';
import { StackScreenProps } from '@react-navigation/stack';

export enum Routes {
  splash = 'splash',
  onboarding = 'onboarding',
  home = 'home',
  signIn = 'signin',
  signUp = 'signUp',
  forgotPassword = 'forgotpassword',
  resetPassword = 'resetPassword',
  profile = 'profile',
  profilePreferencePicker = 'profile-preference-picker',
}

export type RootStackParamList = {
  [Routes.splash]: undefined;
  [Routes.onboarding]: undefined;
  [Routes.home]: undefined;
  [Routes.signIn]: undefined;
  [Routes.signUp]: undefined;
  [Routes.forgotPassword]: undefined;
  [Routes.resetPassword]: undefined;
  [Routes.profile]: undefined;
  [Routes.profilePreferencePicker]: ProfilePreferencePickerParams;
};

// region Screen props

export type UserProfileProps = StackScreenProps<RootStackParamList, Routes.profile>;

export type UserProfilePreferencePickerProps = StackScreenProps<RootStackParamList, Routes.profilePreferencePicker>;

// endregion

// region Route params

export type ProfilePreferencePickerParams = { preference: NotificareUserPreference };

// endregion
