import React, { FC } from 'react';
import { useNotificare } from '../lib/notificare/hooks';
import { InboxProps } from '../routes';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNetworkRequest } from '../lib/machines/network';
import { Loader } from '../components/loader';
import { InboxItem } from '../components/inbox-item';

export const Inbox: FC<InboxProps> = ({}) => {
  const notificare = useNotificare();
  const [request] = useNetworkRequest(() => notificare.fetchInbox(), { autoStart: true });

  return (
    <>
      {(request.status === 'idle' || request.status === 'pending') && <Loader />}

      {request.status === 'successful' && (
        <>
          {!request.result.length && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyMessage}>No messages found</Text>
            </View>
          )}

          {request.result.length > 0 && (
            <ScrollView contentContainerStyle={styles.container}>
              {request.result.map((item, index) => (
                <InboxItem item={item} key={index} />
              ))}
            </ScrollView>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {},
});
