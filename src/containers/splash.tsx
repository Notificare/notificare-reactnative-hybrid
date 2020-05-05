import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Logo from '../assets/images/logo.png';
import { useNotificare } from '../lib/notificare/hooks';
import { StackActions, useNavigation } from '@react-navigation/native';
import { getOnboardingStatus, setCustomScript, setDemoSourceConfig, setMemberCardTemplate } from '../lib/utils/storage';
import { fetchDemoSourceConfig, fetchString } from '../lib/utils/assets-helper';
import { Notificare } from '../lib/notificare';

export const Splash: FC = () => {
  const navigation = useNavigation();

  const notificare = useNotificare({
    onReady: async () => {
      console.log('Notificare is ready.');
      await notificare.addTag('react-native');

      await fetchConfig(notificare);
      await fetchCustomScript(notificare);
      await fetchPassbookTemplate(notificare);

      const introShown = await getOnboardingStatus();
      navigation.dispatch(StackActions.replace(introShown ? 'home' : 'onboarding'));
    },
  });

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    maxWidth: 250,
    resizeMode: 'contain',
  },
});

async function fetchConfig(notificare: Notificare) {
  console.log('Fetching configuration assets.');

  try {
    const asset = (await notificare.fetchAssets('CONFIG')).pop();
    if (asset == null) {
      console.warn(
        'The Notificare app is not correctly configured. Missing the CONFIG asset group and/or demoSourceConfig.json',
      );
      return;
    }

    const config = await fetchDemoSourceConfig(asset.assetUrl!);
    await setDemoSourceConfig(config);
  } catch (e) {
    console.log(`Failed to fetch the configuration assets: ${e}`);
  }
}

async function fetchCustomScript(notificare: Notificare) {
  console.log('Fetching custom script assets.');

  try {
    const asset = (await notificare.fetchAssets('CUSTOMJS')).pop();
    if (asset == null) {
      console.warn(
        'The Notificare app is not correctly configured. Missing the CUSTOMJS asset group and/or customScriptsDemo.js',
      );
      return;
    }

    const customScript = await fetchString(asset.assetUrl!);
    await setCustomScript(customScript);
  } catch (e) {
    console.log(`Failed to fetch the custom script assets: ${e}`);
  }
}

async function fetchPassbookTemplate(notificare: Notificare) {
  console.log('Fetching passbook template.');

  try {
    const template = await notificare.doCloudHostOperation('GET', '/passbook');
    await setMemberCardTemplate(template);
  } catch (e) {
    console.log(`Failed to fetch the passbook template: ${e}`);
  }
}
