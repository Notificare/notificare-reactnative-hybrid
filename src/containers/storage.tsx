import React, { FC, useState } from 'react';
import { StorageProps } from '../routes';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import { Colors } from '../lib/theme';
import { useNetworkRequest } from '../lib/machines/network';
import { useNotificare } from '../lib/notificare/hooks';
import { Loader } from '../components/loader';
import { NotificareAsset } from '../lib/notificare/models';
import AssetVideo from '../assets/images/asset_video.png';
import AssetPdf from '../assets/images/asset_pdf.png';
import AssetJson from '../assets/images/asset_json.png';
import AssetJavascript from '../assets/images/asset_js.png';
import AssetCss from '../assets/images/asset_css.png';
import AssetHtml from '../assets/images/asset_html.png';
import AssetSound from '../assets/images/asset_sound.png';
import AssetText from '../assets/images/asset_text.png';

export const Storage: FC<StorageProps> = () => {
  const notificare = useNotificare();
  const [search, setSearch] = useState('LANDSCAPES');
  const [request, requestActions] = useNetworkRequest(() => notificare.fetchAssets(search));

  const showAsset = async (asset: NotificareAsset) => {
    const contentType = asset.assetMetaData?.contentType;
    switch (contentType) {
      case 'image/jpeg':
      case 'image/gif':
      case 'image/png':
      case 'video/mp4':
      case 'application/pdf':
      case 'text/html':
      case 'audio/mp3':
        if (asset.assetUrl != null) {
          try {
            if (await Linking.canOpenURL(asset.assetUrl)) {
              await Linking.openURL(asset.assetUrl);
            }
          } catch (e) {
            console.log(`Failed to open url: ${e}`);
          }
        }
        break;
    }
  };

  return (
    <>
      <SearchBar
        lightTheme
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        searchIcon={<Icon type="material" name="search" />}
        cancelIcon={<Icon type="material" name="search" />}
        placeholder="Search for an asset group"
        value={search}
        onChangeText={(text) => setSearch(text)}
        onSubmitEditing={() => requestActions.start().catch((e) => console.log(`Failed to fetch asset group: ${e}`))}
      />

      {request.status === 'idle' && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Use the search option above to search for asset groups created in the dashboard.
          </Text>
        </View>
      )}

      {request.status === 'pending' && <Loader />}

      {request.status === 'failed' && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>No asset group found</Text>
        </View>
      )}

      {request.status === 'successful' && !request.result.length && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>No assets found.</Text>
        </View>
      )}

      {request.status === 'successful' && request.result.length > 0 && (
        <FlatList
          data={request.result}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableHighlight
              underlayColor={Colors.touchableFeedback}
              style={{ flex: 1, maxWidth: '50%' }}
              onPress={() => showAsset(item)}
            >
              <View style={styles.assetContainer}>
                <Image style={styles.assetImage} source={buildImageSource(item)} />
                <Text style={styles.assetTitle}>{item.assetTitle}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    padding: 0,
  },
  searchBarInputContainer: {
    borderRadius: 0,
    backgroundColor: Colors.wildSand,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  message: {
    textAlign: 'center',
  },
  assetContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 8,
  },
  assetImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  assetTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
});

function buildImageSource(asset: NotificareAsset): ImageSourcePropType {
  const contentType = asset.assetMetaData?.contentType;

  switch (contentType) {
    case 'image/jpeg':
    case 'image/gif':
    case 'image/png':
      return { uri: asset.assetUrl };
    case 'video/mp4':
      return AssetVideo;
    case 'application/pdf':
      return AssetPdf;
    case 'application/json':
      return AssetJson;
    case 'text/javascript':
      return AssetJavascript;
    case 'text/css':
      return AssetCss;
    case 'text/html':
      return AssetHtml;
    case 'audio/mp3':
      return AssetSound;
    default:
      return AssetText;
  }
}
