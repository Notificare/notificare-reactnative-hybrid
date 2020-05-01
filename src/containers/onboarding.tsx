import React, { FC, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { useNotificare } from '../notificare/hooks';
import { Loader } from '../components/loader';
import { useNetworkRequest } from '../machines/network';
import { NotificareAsset } from '../notificare/models';
import { Colors } from '../theme';

export const Onboarding: FC = () => {
  const notificare = useNotificare();
  const [state] = useNetworkRequest(notificare.fetchAssets('ONBOARDING'), { autoStart: true });

  const [page, setPage] = useState(0);
  const viewPagerRef = useRef<ViewPager>();

  const onButtonPress = (asset: NotificareAsset) => {
    switch (asset.assetButton?.action) {
      case 'goToLocationServices':
        registerForNotifications();
        break;
      case 'goToApp':
        startLocationUpdates();
        return;
    }

    viewPagerRef.current?.setPage(page + 1);
  };

  const registerForNotifications = () => {};

  const startLocationUpdates = () => {};

  return (
    <>
      {(state.status === 'idle' || state.status === 'pending') && <Loader />}

      {state.status === 'successful' && (
        <ViewPager
          // @ts-ignore
          ref={viewPagerRef}
          style={styles.viewPager}
          scrollEnabled={false}
          onPageSelected={(event) => setPage(event.nativeEvent.position)}
        >
          {/*<Page key="1" asset={state.result[0]} />*/}
          {state.result.map((value, index) => (
            <Page key={index} asset={value} onButtonPress={onButtonPress} />
          ))}
        </ViewPager>
      )}
    </>
  );
};

// region ViewPager Page

const Page: FC<PageProps> = (props) => {
  const { asset, onButtonPress } = props;

  return (
    <View style={styles.page}>
      <Image source={{ uri: asset.assetUrl }} style={styles.pageImage} />
      <View style={styles.pageContent}>
        <Text style={styles.pageContentTitle}>{asset.assetTitle}</Text>
        <Button color={Colors.outerSpace} title={asset.assetButton?.label ?? ''} onPress={() => onButtonPress(asset)} />
      </View>
    </View>
  );
};

interface PageProps {
  asset: NotificareAsset;
  onButtonPress: (asset: NotificareAsset) => void;
}

// endregion

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  page: {
    backgroundColor: 'red',
  },
  pageImage: {
    width: '100%',
    height: '100%',
  },
  pageContent: {
    position: 'absolute',
    bottom: 32,
    start: 16,
    end: 16,
  },
  pageContentTitle: {
    alignSelf: 'center',
    marginBottom: 32,
    color: Colors.grey,
    fontSize: 20,
    textAlign: 'center',
  },
});
