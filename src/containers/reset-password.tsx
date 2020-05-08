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

export const ResetPassword: FC<ResetPasswordProps> = ({ token }) => {
  const navigation = useNavigation();
  const notificare = useNotificare();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [state, actions] = useNetworkRequest(() => notificare.resetPassword(token, password));

  const onRecoverPasswordPress = () => {
    if (!password.trim().length || !passwordConfirmation.trim().length) {
      return showAlertDialog('Please fill in all fields.');
    }

    if (password.length < 6) {
      return showAlertDialog('Password is too short.');
    }

    if (password !== passwordConfirmation) {
      return showAlertDialog('Passwords do not match. Please confirm the same password twice.');
    }

    actions
      .start()
      .then(() =>
        showAlertDialog('Password reset successfully.', {
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
            keyboardType={'visible-password'}
            placeholder="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.inputField}
          />

          <TextInput
            keyboardType={'visible-password'}
            placeholder="password confirmation"
            value={passwordConfirmation}
            onChangeText={(text) => setPasswordConfirmation(text)}
            style={styles.inputField}
          />

          <View style={styles.buttonContainer}>
            <Button text="Reset password" onPress={() => onRecoverPasswordPress()} style={styles.button} />
          </View>
        </ScrollView>
      )}
    </>
  );
};

interface ResetPasswordProps {
  token: string;
}

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
