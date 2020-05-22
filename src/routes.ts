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
};

// region Screen props

export type HomeProps = StackScreenProps<RootStackParamList, Routes.home>;

export type UserProfileProps = StackScreenProps<RootStackParamList, Routes.profile>;

export type UserProfilePreferencePickerProps = StackScreenProps<RootStackParamList, Routes.profilePreferencePicker>;

export type MemberCardProps = StackScreenProps<RootStackParamList, Routes.memberCard>;

export type ChangePasswordProps = StackScreenProps<RootStackParamList, Routes.changePassword>;

export type AccountValidationProps = StackScreenProps<RootStackParamList, Routes.accountValidation>;

export type ResetPasswordProps = StackScreenProps<RootStackParamList, Routes.resetPassword>;

// endregion

// region Route params

export type ProfilePreferencePickerParams = { preference: NotificareUserPreference };

export type AccountValidationParams = { token: string };

export type ResetPasswordParams = { token: string };

// endregion
