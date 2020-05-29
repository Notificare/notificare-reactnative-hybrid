import React, { FC, useState } from 'react';
import { Loader } from '../components/loader';
import { Image, ScrollView, StyleSheet } from 'react-native';
import HeaderImage from '../assets/images/key.png';
import { useNotificare } from '../lib/notificare/hooks';
import { useNetworkRequest } from '../lib/machines/network';
import { Colors } from '../lib/theme';
import { showAlertDialog } from '../lib/utils/ui';
import { Button, Input } from 'react-native-elements';
import { ForgotPasswordProps } from '../routes';

export const ForgotPassword: FC<ForgotPasswordProps> = ({ navigation }) => {
  const notificare = useNotificare();

  const [email, setEmail] = useState('');

  const [state, actions] = useNetworkRequest(() => notificare.sendPassword(email));

  const onRecoverPasswordPress = () => {
    if (!email.trim().length || !email.includes('@')) {
      return showAlertDialog('Please fill in a valid email.');
    }

    actions
      .start()
      .then(() =>
        showAlertDialog('Account found. Please check your mailbox for more information.', {
          onPositiveButtonPress: () => navigation.goBack(),
        }),
      )
      .catch((e) => showAlertDialog(e.message));
  };

  return (
    <>
      {state.status === 'pending' && <Loader />}

      {(state.status === 'idle' || state.status === 'failed') && (
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={HeaderImage} style={styles.headerImage} />

          <Input
            keyboardType={'email-address'}
            placeholder="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Button title="Recover password" onPress={() => onRecoverPasswordPress()} containerStyle={styles.button} />
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
    height: 200,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  inputField: {
    marginTop: 16,
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexShrink: 1,
    flexGrow: 0,
    flexBasis: 0,
    flexDirection: 'column',
  },
  button: {
    marginTop: 16,
  },
});
