import DefaultPreference from 'react-native-default-preference';

const kOnboardingStatus = 'onboarding_status';

export async function getOnboardingStatus(): Promise<boolean> {
  const status = await DefaultPreference.get(kOnboardingStatus);
  return Boolean(status);
}

export async function setOnboardingStatus(status: boolean): Promise<void> {
  await DefaultPreference.set(kOnboardingStatus, status.toString());
}
