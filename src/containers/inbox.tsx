import React, { FC, useEffect, useState } from 'react';
import { useNotificare } from '../lib/notificare/hooks';
import { InboxProps } from '../routes';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Loader } from '../components/loader';
import { InboxItem } from '../components/inbox-item';
import { NotificareInboxItem } from '../lib/notificare/models';
import { Button, Icon } from 'react-native-elements';

export const Inbox: FC<InboxProps> = ({ navigation }) => {
  const notificare = useNotificare({
    onInboxLoaded: (inbox) => setState({ loading: false, data: inbox }),
  });
  const [state, setState] = useState<InboxState>({ loading: true, data: [] });
  const [selectedItems, setSelectedItems] = useState<NotificareInboxItem[]>([]);

  const onItemPress = (item: NotificareInboxItem) => {
    if (selectedItems.length > 0) {
      onItemLongPress(item);
      return;
    }

    notificare.presentInboxItem(item);
  };

  const onItemLongPress = (item: NotificareInboxItem) => {
    const isSelected = selectedItems.includes(item);

    if (!isSelected) {
      setSelectedItems((prevState) => [...prevState, item]);
    } else {
      setSelectedItems((prevState) => {
        const index = prevState.indexOf(item);
        if (index > -1) {
          prevState.splice(index, 1);
        }

        return [...prevState];
      });
    }
  };

  const markSelectedInboxItems = async () => {
    setState({ loading: true, data: [] });

    for (let item of selectedItems) {
      try {
        await notificare.markAsRead(item);
      } catch (e) {
        console.log(`Failed to mark item as read: ${e}`);
      }
    }

    reloadData();
    setSelectedItems([]);
  };

  const deleteSelectedInboxItems = async () => {
    setState({ loading: true, data: [] });

    for (let item of selectedItems) {
      try {
        await notificare.removeFromInbox(item);
      } catch (e) {
        console.log(`Failed to remove item from inbox: ${e}`);
      }
    }

    setTimeout(() => {
      reloadData();
      setSelectedItems([]);
    }, 250);
  };

  const clearInboxItems = async () => {
    setState({ loading: true, data: [] });

    try {
      await notificare.clearInbox();
    } catch (e) {
      console.log(`Failed to clear the inbox: ${e}`);
    }

    setTimeout(() => {
      reloadData();
      setSelectedItems([]);
    }, 250);
  };

  const reloadData = () => {
    setState({ loading: true, data: [] });

    notificare
      .fetchInbox()
      .then((data) => setState({ loading: false, data }))
      .catch(() => setState({ loading: false, data: [] }));
  };

  useEffect(() => {
    if (!selectedItems.length) {
      navigation.setOptions({
        title: 'Inbox',
        headerRight: () => (
          <Button type="clear" icon={<Icon type="material" name="delete-sweep" />} onPress={clearInboxItems} />
        ),
      });
    } else {
      navigation.setOptions({
        title: `${selectedItems.length}`,
        headerRight: ({ tintColor }) => (
          <View style={{ flexDirection: 'row' }}>
            <Button
              type="clear"
              icon={<Icon type="material" name="drafts" color={tintColor} />}
              onPress={markSelectedInboxItems}
            />
            <Button
              type="clear"
              icon={<Icon type="material" name="delete" color={tintColor} />}
              onPress={deleteSelectedInboxItems}
            />
          </View>
        ),
      });
    }
  }, [navigation, selectedItems]);

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <>
      {state.loading && <Loader />}

      {!state.loading && (
        <>
          {!state.data.length && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyMessage}>No messages found</Text>
            </View>
          )}

          {state.data.length > 0 && (
            <ScrollView contentContainerStyle={styles.container}>
              {state.data.map((item, index) => (
                <InboxItem
                  key={index}
                  item={item}
                  selected={selectedItems.indexOf(item) > -1}
                  onPress={() => onItemPress(item)}
                  onLongPress={() => onItemLongPress(item)}
                />
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

interface InboxState {
  loading: boolean;
  data: NotificareInboxItem[];
}
