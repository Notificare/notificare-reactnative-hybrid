import React, { FC } from 'react';
import { AccountValidationProps } from '../routes';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import { useNotificare } from '../lib/notificare/hooks';
import { useNetworkRequest } from '../lib/machines/network';
import { Loader } from '../components/loader';
import { Colors } from '../lib/theme';

export const AccountValidation: FC<AccountValidationProps> = ({ navigation, route }) => {
  const notificare = useNotificare();
  const [request, actions] = useNetworkRequest(() => notificare.validateAccount(route.params.token), {
    autoStart: true,
  });

  return (
    <>
      {(request.status === 'idle' || request.status === 'pending') && <Loader />}

      {request.status === 'successful' && (
        <ScrollView contentContainerStyle={styles.container}>
          <Icon type="material" name="check-circle" color="#00C853" size={128} />

          <Text style={[styles.title, styles.mt]}>Your account has been validated!</Text>

          <Text style={styles.subtitle}>You can login now.</Text>

          <Button title="Take me home" containerStyle={styles.mt} onPress={() => navigation.goBack()} />
        </ScrollView>
      )}

      {request.status === 'failed' && (
        <ScrollView contentContainerStyle={styles.container}>
          <Icon type="material" name="error" color={Colors.error} size={128} />

          <Text style={[styles.title, styles.mt]}>Something went wrong.</Text>

          <Text style={styles.subtitle}>We couldn't validate your account.</Text>

          <Button
            title="Try again"
            containerStyle={styles.mt}
            onPress={() => actions.start().catch((e) => console.log(`Retry failed: ${e}`))}
          />
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    color: Colors.blackHighEmphasis,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.blackHighEmphasis,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  mt: {
    marginTop: 16,
  },
});
