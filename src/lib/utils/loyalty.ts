import { getMemberCardTemplate, setMemberCardSerial } from './storage';
import { createGravatarUrl } from './index';
import { Notificare } from '../notificare';

export async function createMemberCard(name: string, email: string): Promise<void> {
  name = name.trim();
  email = email.trim().toLowerCase();

  console.log(`Creating member card for: ${email}`);
  let payload: Record<string, any>;

  try {
    const template = await getMemberCardTemplate();
    if (template == null) return;

    payload = template;
    payload.passbook = payload._id;
    payload.data.thumbnail = createGravatarUrl(email);

    const primaryFields = payload.data.primaryFields as any[];
    primaryFields.forEach((field) => {
      if (field.key === 'name') {
        field.value = name;
      }
    });

    const secondaryFields = payload.data.secondaryFields as any[];
    secondaryFields.forEach((field) => {
      if (field.key === 'email') {
        field.value = email;
      }
    });
  } catch (e) {
    console.log(`Failed to parse and pre-fill the member card: ${e}`);
    return;
  }

  try {
    const result = await new Notificare().doCloudHostOperation('POST', '/pass', undefined, undefined, payload);

    const serial = result.pass.serial as string;
    await setMemberCardSerial(serial);
  } catch (e) {
    console.log(`Failed to create a member card: ${e}`);
  }
}
