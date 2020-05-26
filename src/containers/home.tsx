import React, { FC, useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import WebView from 'react-native-webview';
import { useNetworkRequest } from '../lib/machines/network';
import { getCustomScript, getDemoSourceConfig } from '../lib/utils/storage';
import { Loader } from '../components/loader';
import { useNavigation } from '@react-navigation/native';
import * as URL from 'url';
import { trimSlashes } from '../lib/utils';
import { useNotificare } from '../lib/notificare/hooks';
import { HomeProps, Routes } from '../routes';
import { showAlertDialog } from '../lib/utils/ui';

export const Home: FC<HomeProps> = ({ navigation }) => {
  const notificare = useNotificare({
    onBadgeUpdated: (unreadCount) => updateBadge(unreadCount),
    onActivationTokenReceived: (data) => {
      navigation.push(Routes.accountValidation, { token: data.token });
    },
    onResetPasswordTokenReceived: (data) => {
      navigation.push(Routes.resetPassword, { token: data.token });
    },
  });

  const [state] = useNetworkRequest(() => getDemoSourceConfig(), { autoStart: true });
  useDeepLinking();

  const webViewRef = useRef<WebView>(null);

  const updateBadge = async (unreadCount?: number) => {
    try {
      const script = await getCustomScript();
      if (script == null) return;

      if (unreadCount === undefined) {
        const inbox = await notificare.fetchInbox();
        unreadCount = inbox.filter((item) => !item.opened).length;
      }

      const badge = unreadCount > 0 ? `${unreadCount}` : '';
      const js = script.replace('%@', badge);

      webViewRef.current?.injectJavaScript(
        `javascript:(function() {var parent = document.getElementsByTagName('head').item(0);var script = document.createElement('script');script.type = 'text/javascript';script.innerHTML = ${js};parent.appendChild(script)})()`,
      );
    } catch (e) {
      console.log(`Failed to update the badge: ${e}`);
    }
  };

  return (
    <>
      {(state.status == 'idle' || state.status == 'pending') && <Loader />}

      {state.status == 'successful' && (
        <WebView
          ref={webViewRef}
          source={{ uri: state.result!.url }}
          javaScriptEnabled={true}
          onLoadEnd={() => updateBadge()}
        />
      )}
    </>
  );
};

const useDeepLinking = () => {
  const navigation = useNavigation();
  const notificare = useNotificare({
    onScannableDetected: (scannable) => {
      if (scannable.notification) {
        notificare.presentScannable(scannable);
      } else {
        showAlertDialog('Custom scannable found. The app is responsible for handling it.');
      }
    },
    onScannableSessionInvalidatedWithError: ({ error }) => {
      showAlertDialog(error);
    },
    onUrlOpened: ({ url }) => {
      handleDeepLinkingUrl(url);
    },
  });

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
        navigation.navigate(trimSlashes(url.path));
        break;
      case '/scan':
        notificare.startScannableSession();
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
