import React, { FC, useEffect } from 'react';
import { Linking } from 'react-native';
import WebView from 'react-native-webview';
import { useNetworkRequest } from '../lib/machines/network';
import { getDemoSourceConfig } from '../lib/utils/storage';
import { Loader } from '../components/loader';
import { useNavigation } from '@react-navigation/native';
import * as URL from 'url';

export const Home: FC = () => {
  const [state] = useNetworkRequest(getDemoSourceConfig(), { autoStart: true });
  useDeepLinking();

  return (
    <>
      {(state.status == 'idle' || state.status == 'pending') && <Loader />}

      {state.status == 'successful' && <WebView source={{ uri: state.result!.url }} javaScriptEnabled={true} />}
    </>
  );
};

const useDeepLinking = () => {
  const navigation = useNavigation();

  const handleDeepLinkingUrl = (urlStr: string | null) => {
    if (urlStr == null) {
      console.debug('Received a deep link but its URL is null. Skipping...');
      return;
    }

    console.debug(`Received a deep link: ${urlStr}`);
    const url = URL.parse(urlStr);

    switch (url.path) {
      case '/inbox':
      case '/settings':
      case '/regions':
      case '/beacons':
      case '/profile':
      case '/membercard':
      case '/signin':
      case '/signup':
      case '/analytics':
      case '/storage':
        navigation.navigate(url.path);
        break;
      case '/scan':
        // TODO start scannable session
        break;
    }
  };

  // Removing a listener requires a reference to the original listener.
  const handleDeepLinkingEvent = (event: { url: string }) => handleDeepLinkingUrl(event.url);

  useEffect(() => {
    // Check if the app was started with a deep link.
    Linking.getInitialURL()
      .then((url) => {
        if (url != null) handleDeepLinkingUrl(url);
      })
      .catch((e) => console.log(`Failed to get the initial deep link: ${e}`));

    // Listen for deep linking event.
    Linking.addEventListener('url', handleDeepLinkingEvent);

    // Clean up the listener.
    return () => Linking.removeEventListener('url', handleDeepLinkingEvent);
  }, []);
};
