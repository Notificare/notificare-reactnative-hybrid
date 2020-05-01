import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Logo from '../assets/images/logo.png';
import { useNavigation, StackActions } from '@react-navigation/native';

export const Splash: FC = () => {
  const navigation = useNavigation();

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
