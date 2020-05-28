import React, { FC, useState } from 'react';
import { BeaconsProps } from '../routes';
import { useNotificare } from '../lib/notificare/hooks';
import { NotificareBeacon } from '../lib/notificare/models';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ListItem } from '../components/list-item';
import { Divider } from 'react-native-elements';

export const Beacons: FC<BeaconsProps> = () => {
  useNotificare({
    onBeaconsInRangeForRegion: ({ beacons }) => setBeacons(beacons),
  });

  const [beacons, setBeacons] = useState<NotificareBeacon[]>([]);

  return (
    <>
      {beacons.length == 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyMessage}>No beacons found</Text>
        </View>
      )}

      {beacons.length > 0 && (
        <FlatList
          data={beacons}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <>
              <ListItem primaryText={item.name} />
              <Divider />
            </>
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
  },
});
