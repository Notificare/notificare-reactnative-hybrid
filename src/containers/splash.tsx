import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Logo from '../assets/images/logo.png';
import { useNotificare } from '../notificare/hooks';
import { useNavigation, StackActions } from '@react-navigation/native';
import { getOnboardingStatus } from '../utils/storage';

export const Splash: FC = () => {
  const navigation = useNavigation();

  const notificare = useNotificare({
    onReady: async () => {
      console.log('Notificare is ready.');

      // TODO fetch config
      // TODO fetch custom script
      // TODO fetch passbook template

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
