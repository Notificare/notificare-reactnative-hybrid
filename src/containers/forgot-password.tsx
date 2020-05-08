import React, { FC, useState } from 'react';
import { Loader } from '../components/loader';
import { Image, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import HeaderImage from '../assets/images/key.png';
import { Button } from '../components/button';
import { useNotificare } from '../lib/notificare/hooks';
import { useNavigation } from '@react-navigation/native';
import { useNetworkRequest } from '../lib/machines/network';
import { Colors } from '../lib/theme';
import { showAlertDialog } from '../lib/utils/ui';

export const ForgotPassword: FC = () => {
  const navigation = useNavigation();
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

          <TextInput
            keyboardType={'email-address'}
            placeholder="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.inputField}
          />

          <View style={styles.buttonContainer}>
            <Button text="Recover password" onPress={() => onRecoverPasswordPress()} style={styles.button} />
          </View>
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
