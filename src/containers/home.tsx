import React, { FC, useEffect, useRef } from 'react';
import { Linking, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useNetworkRequest } from '../lib/machines/network';
import { getDemoSourceConfig } from '../lib/utils/storage';
import { Loader } from '../components/loader';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { useNavigation } from '@react-navigation/native';

export const Home: FC = () => {
  const [state] = useNetworkRequest(getDemoSourceConfig(), { autoStart: true });
  useDeepLinking();

  const handleNavigationRequest = (event: WebViewNavigation) => {
    console.log('handleNavigationRequest');
    console.log(event);
    return true;
  };

  return (
    <>
      {(state.status == 'idle' || state.status == 'pending') && <Loader />}

      {state.status == 'successful' && (
        <WebView
          source={{ uri: state.result!.url }}
          javaScriptEnabled={true}
          onShouldStartLoadWithRequest={(event) => handleNavigationRequest(event)}
        />
      )}
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

const useDeepLinking = () => {
  const navigation = useNavigation();

  const handleDeepLinkingUrl = (url: string | null) => {
    console.log(`Received a deep link: ${url}`);
  };

  // Removing a listener requires a reference to the original listener.
  const handleDeepLinkingEvent = (event: { url: string }) => handleDeepLinkingUrl(event.url);

  useEffect(() => {
    // Check if the app was started with a deep link.
    Linking.getInitialURL()
      .then((url) => handleDeepLinkingUrl(url))
      .catch((e) => console.log(`Failed to get the initial deep link: ${e}`));

    // Listen for deep linking event.
    Linking.addEventListener('url', handleDeepLinkingEvent);

    // Clean up the listener.
    return () => Linking.removeEventListener('url', handleDeepLinkingEvent);
  }, []);
};
