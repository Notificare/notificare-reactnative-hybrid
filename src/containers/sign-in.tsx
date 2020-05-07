import React, { FC, useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import HeaderImage from '../assets/images/padlock.png';
import { Button } from '../components/button';
import { Colors } from '../lib/theme';
import { useNotificare } from '../lib/notificare/hooks';
import { StackActions, useNavigation } from '@react-navigation/native';
import { showAlertDialog } from '../lib/utils/ui';
import { useNetworkRequest } from '../lib/machines/network';
import { Notificare } from '../lib/notificare';
import { Loader } from '../components/loader';

export const SignIn: FC = () => {
  const navigation = useNavigation();
  const notificare = useNotificare();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [state, actions] = useNetworkRequest(() => performSignIn(notificare, email, password));

  const onSignIn = async () => {
    if (!email.trim().length || !password.trim().length) {
      return showAlertDialog('Invalid credentials.');
    }

    if (!email.includes('@')) {
      return showAlertDialog('Invalid email address.');
    }

    try {
      // Run the sign in procedure.
      await actions.start();

      // Go to the user profile.
      navigation.dispatch(StackActions.replace('profile'));
    } catch (e) {
      showAlertDialog('Invalid credentials.');
      setPassword('');
    }
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

          <TextInput
            keyboardType={'visible-password'}
            placeholder="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.inputField}
          />

          <View style={styles.buttonContainer}>
            <Button
              text="Forgotten password"
              onPress={() => navigation.navigate('forgotpassword')}
              style={[styles.button, styles.forgotPasswordButton]}
              textStyle={styles.forgotPasswordButtonText}
            />

            <Button text="Sign in" onPress={() => onSignIn()} style={styles.button} />

            <Button text="Create an account" onPress={() => navigation.navigate('signup')} style={styles.button} />
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
  forgotPasswordButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  forgotPasswordButtonText: {
    color: Colors.grey,
  },
});

async function performSignIn(notificare: Notificare, email: string, password: string): Promise<void> {
  await notificare.login(email, password);
  const user = await notificare.fetchAccountDetails();

  // Create and update the current member card
  // todo await createMemberCard(user.userName, user.userID);
}
