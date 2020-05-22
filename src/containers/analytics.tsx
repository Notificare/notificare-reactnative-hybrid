import React, { FC, useState } from 'react';
import { AnalyticsProps } from '../routes';
import HeaderImage from '../assets/images/profits.png';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Colors } from '../lib/theme';
import { useNetworkRequest } from '../lib/machines/network';
import { useNotificare } from '../lib/notificare/hooks';
import { Loader } from '../components/loader';
import { showAlertDialog } from '../lib/utils/ui';

export const Analytics: FC<AnalyticsProps> = () => {
  const notificare = useNotificare();
  const [eventName, setEventName] = useState<{ value: string; errorMessage?: string }>({ value: '' });
  const [request, actions] = useNetworkRequest(() => notificare.logCustomEvent(eventName.value.trim()));

  const onTrackEvent = async () => {
    try {
      const event = eventName.value.trim();

      if (!event.length) {
        return setEventName((prevState) => ({ ...prevState, errorMessage: 'Please fill in a value.' }));
      }

      await actions.start();

      showAlertDialog(
        'Custom event registered successfully. Please check your dashboard to see the results for this event name.',
      );

      setEventName({ value: '' });
    } catch (e) {
      console.log(`Failed to track the event: ${e}`);
      showAlertDialog(e.message);
    }
  };

  return (
    <>
      {request.status === 'pending' && <Loader />}

      {(request.status === 'idle' || request.status === 'successful' || request.status === 'failed') && (
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={HeaderImage} style={styles.headerImage} />

          <Text style={[styles.title, styles.mt]}>Register a custom event</Text>

          <Input
            placeholder="Event name"
            containerStyle={styles.mt}
            value={eventName.value}
            errorMessage={eventName.errorMessage}
            errorStyle={!eventName.errorMessage ? styles.formErrorHidden : undefined}
            onChangeText={(text) => setEventName({ value: text })}
          />

          <Button title="Track event" containerStyle={styles.mt} onPress={onTrackEvent} />
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerImage: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
  },
  title: {
    color: Colors.blackHighEmphasis,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  formErrorHidden: {
    display: 'none',
  },
  mt: {
    marginTop: 16,
  },
});
