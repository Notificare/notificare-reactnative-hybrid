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
  memberCard = 'membercard',
  changePassword = 'change-password',
  accountValidation = 'account-validation',
  analytics = 'analytics',
  inbox = 'inbox',
  regions = 'regions',
  storage = 'storage',
  beacons = 'beacons',
  settings = 'settings',
}

export type RootStackParamList = {
  [Routes.splash]: undefined;
  [Routes.onboarding]: undefined;
  [Routes.home]: undefined;
  [Routes.signIn]: undefined;
  [Routes.signUp]: undefined;
  [Routes.forgotPassword]: undefined;
  [Routes.resetPassword]: ResetPasswordParams;
  [Routes.profile]: undefined;
  [Routes.profilePreferencePicker]: ProfilePreferencePickerParams;
  [Routes.memberCard]: undefined;
  [Routes.changePassword]: undefined;
  [Routes.accountValidation]: AccountValidationParams;
  [Routes.analytics]: undefined;
  [Routes.inbox]: undefined;
  [Routes.regions]: undefined;
  [Routes.storage]: undefined;
  [Routes.beacons]: undefined;
  [Routes.settings]: undefined;
};

// region Screen props

export type HomeProps = StackScreenProps<RootStackParamList, Routes.home>;

export type UserProfileProps = StackScreenProps<RootStackParamList, Routes.profile>;

export type UserProfilePreferencePickerProps = StackScreenProps<RootStackParamList, Routes.profilePreferencePicker>;

export type MemberCardProps = StackScreenProps<RootStackParamList, Routes.memberCard>;

export type ChangePasswordProps = StackScreenProps<RootStackParamList, Routes.changePassword>;

export type AccountValidationProps = StackScreenProps<RootStackParamList, Routes.accountValidation>;

export type ResetPasswordProps = StackScreenProps<RootStackParamList, Routes.resetPassword>;

export type AnalyticsProps = StackScreenProps<RootStackParamList, Routes.analytics>;

export type InboxProps = StackScreenProps<RootStackParamList, Routes.inbox>;

export type RegionsProps = StackScreenProps<RootStackParamList, Routes.regions>;

export type StorageProps = StackScreenProps<RootStackParamList, Routes.storage>;

export type BeaconsProps = StackScreenProps<RootStackParamList, Routes.beacons>;

export type SettingsProps = StackScreenProps<RootStackParamList, Routes.settings>;

export type SignInProps = StackScreenProps<RootStackParamList, Routes.signIn>;

export type SignUpProps = StackScreenProps<RootStackParamList, Routes.signUp>;

// endregion

// region Route params

export type ProfilePreferencePickerParams = { preference: NotificareUserPreference };

export type AccountValidationParams = { token: string };

export type ResetPasswordParams = { token: string };

// endregion
