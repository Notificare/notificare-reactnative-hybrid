import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useNetworkRequest } from '../lib/machines/network';
import { getDemoSourceConfig } from '../lib/utils/storage';
import { Loader } from '../components/loader';

export const Home: FC = () => {
  const [state] = useNetworkRequest(getDemoSourceConfig(), { autoStart: true });

  return (
    <>
      {(state.status == 'idle' || state.status == 'pending') && <Loader />}

      {state.status == 'successful' && <WebView source={{ uri: state.result!.url }} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
