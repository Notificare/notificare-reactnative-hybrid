import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NotificareInboxItem } from '../lib/notificare/models';
import NoAttachmentImage from '../assets/images/no_attachment.png';
import { Divider } from 'react-native-elements';
import { Typography } from '../lib/theme';
import TimeAgo from 'react-native-timeago';

export const InboxItem: FC<InboxItemProps> = ({ item }) => {
  return (
    <>
      <View style={styles.container}>
        <Image
          source={item.attachment ? { uri: item.attachment.uri } : NoAttachmentImage}
          style={styles.attachmentImage}
        />
        <View style={styles.content}>
          <View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={Typography.body2}>
              {item.title}
            </Text>
            <Text numberOfLines={4} ellipsizeMode="tail" style={Typography.caption}>
              {item.message}
            </Text>
          </View>

          {/* @ts-ignore module typings are incorrect, missing the base TextProps */}
          <TimeAgo time={item.time} interval={5000} style={[Typography.caption, styles.timeAgo]} />
        </View>
      </View>
      <Divider />
    </>
  );
};

interface InboxItemProps {
  item: NotificareInboxItem;
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    minHeight: 120,
    flexDirection: 'row',
  },
  attachmentImage: {
    width: '100%',
    maxWidth: 120,
    height: '100%',
    resizeMode: 'cover',
    marginEnd: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  timeAgo: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
});
