import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { useNotificare } from '../notificare/hooks';
import { Loader } from '../components/loader';
import { useNetworkRequest } from '../machines/network';

export const Onboarding: FC = () => {
  const notificare = useNotificare();
  const [state] = useNetworkRequest(notificare.fetchAssets('ONBOARDING'), { autoStart: true });

  return (
    <>
      {(state.status === 'idle' || state.status === 'pending') && <Loader />}

      {state.status === 'successful' && (
        // @ts-ignore
        <ViewPager style={styles.viewPager} scrollEnabled={false}>
          {/* @ts-ignore */}
          {state.result.map((value, index) => (
            <View key={index} style={styles.container}>
              <Text>{value.assetTitle}</Text>
            </View>
          ))}
        </ViewPager>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
