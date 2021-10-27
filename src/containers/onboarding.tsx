import React, { FC, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { useNotificare } from '../lib/notificare/hooks';
import { Loader } from '../components/loader';
import { useNetworkRequest } from '../lib/machines/network';
import { NotificareAsset } from '../lib/notificare/models';
import { Colors } from '../lib/theme';
import { checkLocationPermission, requestLocationPermission } from '../lib/utils/permissions';
import { getDemoSourceConfig, setOnboardingStatus } from '../lib/utils/storage';
import { StackActions, useNavigation } from '@react-navigation/native';

export const Onboarding: FC = () => {
  const notificare = useNotificare();
  const [state] = useNetworkRequest(() => notificare.fetchAssets('ONBOARDING'), { autoStart: true });

  const [page, setPage] = useState(0);
  const viewPagerRef = useRef<ViewPager>();

  const navigation = useNavigation();

  const onButtonPress = async (asset: NotificareAsset) => {
    switch (asset.assetButton?.action) {
      case 'goToLocationServices':
        notificare.registerForNotifications();
        break;
      case 'goToApp':
        await startLocationUpdates();
        return;
    }

    viewPagerRef.current?.setPage(page + 1);
  };

  const startLocationUpdates = async () => {
    const granted = (await checkLocationPermission()) || (await requestLocationPermission());
    if (!granted) {
      console.log('The user did not grant the location permission.');

      await setOnboardingStatus(true);
      navigation.dispatch(StackActions.replace('home'));

      return;
    }

    console.log('Enabling location updates.');
    notificare.startLocationUpdates();
    notificare.enableBeacons();

    await setOnboardingStatus(true);
    navigation.dispatch(StackActions.replace('home'));
  };

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
    backgroundColor: Colors.wildSand,
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
