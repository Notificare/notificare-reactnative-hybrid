import DefaultPreference from 'react-native-default-preference';

const KEY_ONBOARDING_STATUS = 'onboarding_status';
const KEY_DEMO_SOURCE_CONFIG = 'demo_source_config';
const KEY_CUSTOM_SCRIPT = 'custom_script';
const KEY_MEMBER_CARD_TEMPLATE = 'member_card_template';
const KEY_MEMBER_CARD_SERIAL = 'member_card_serial';

export async function getOnboardingStatus(): Promise<boolean> {
  const status = await DefaultPreference.get(KEY_ONBOARDING_STATUS);
  return Boolean(status);
}

export async function setOnboardingStatus(status: boolean): Promise<void> {
  await DefaultPreference.set(KEY_ONBOARDING_STATUS, status.toString());
}

export async function getDemoSourceConfig(): Promise<DemoSourceConfig | undefined> {
  const jsonStr = await DefaultPreference.get(KEY_DEMO_SOURCE_CONFIG);
  if (jsonStr == null) return undefined;

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.log("Failed to parse the demo source config. Cleaning up what's stored.", e);
    return undefined;
  }
}

export async function setDemoSourceConfig(config: DemoSourceConfig): Promise<void> {
  await DefaultPreference.set(KEY_DEMO_SOURCE_CONFIG, JSON.stringify(config));
}

export async function getCustomScript(): Promise<string | undefined> {
  return await DefaultPreference.get(KEY_CUSTOM_SCRIPT);
}

export async function setCustomScript(customScript: string): Promise<void> {
  await DefaultPreference.set(KEY_CUSTOM_SCRIPT, customScript);
}

export async function getMemberCardTemplate(): Promise<Record<string, any> | undefined> {
  const jsonStr = await DefaultPreference.get(KEY_MEMBER_CARD_TEMPLATE);
  if (jsonStr == null) return undefined;

  return JSON.parse(jsonStr);
}

export async function setMemberCardTemplate(template: Record<string, any>): Promise<void> {
  await DefaultPreference.set(KEY_MEMBER_CARD_TEMPLATE, JSON.stringify(template));
}

export async function getMemberCardSerial(): Promise<string | undefined> {
  return await DefaultPreference.get(KEY_MEMBER_CARD_SERIAL);
}

export async function setMemberCardSerial(serial: string): Promise<void> {
  await DefaultPreference.set(KEY_MEMBER_CARD_SERIAL, serial);
}

// region Types

export interface DemoSourceConfig {
  config: {
    useLocationServices: boolean;
    useNavigationDrawer: boolean;
  };
  url: string;
  urlScheme: string;
  host: string;
  email: string;
  memberCard: {
    templateId: string;
    primaryFields: [MemberCardField];
    secondaryFields: [MemberCardField];
  };
}

export interface MemberCardField {
  name?: string;
  email?: string;
}

// endregion
