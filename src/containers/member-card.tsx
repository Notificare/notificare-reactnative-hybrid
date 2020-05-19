import React, { FC } from 'react';
import { MemberCardProps } from '../routes';
import WebView from 'react-native-webview';
import { useNetworkRequest } from '../lib/machines/network';
import { getMemberCardSerial } from '../lib/utils/storage';
import { Loader } from '../components/loader';

export const MemberCard: FC<MemberCardProps> = () => {
  const [state] = useNetworkRequest(() => getMemberCardSerial(), { autoStart: true });

  return (
    <>
      {(state.status === 'idle' || state.status === 'pending') && <Loader />}

      {state.status === 'successful' && (
        <WebView
          source={{ uri: `https://push.notifica.re/pass/web/${state.result}?showWebVersion=1` }}
          javaScriptEnabled={true}
        />
      )}
    </>
  );
};
