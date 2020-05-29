import React, { FC } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../lib/theme';

export const Loader: FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.outerSpace} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
