import React, { FC, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import HeaderImage from '../assets/images/padlock.png';
import { Colors } from '../lib/theme';
import { useNotificare } from '../lib/notificare/hooks';
import { showAlertDialog } from '../lib/utils/ui';
import { useNetworkRequest } from '../lib/machines/network';
import { Notificare } from '../lib/notificare';
import { Loader } from '../components/loader';
import { createMemberCard } from '../lib/utils/loyalty';
import { Button, Input } from 'react-native-elements';
import { Routes, SignInProps } from '../routes';

export const SignIn: FC<SignInProps> = ({ navigation }) => {
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
      navigation.replace(Routes.profile);
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

          <Input
            keyboardType="email-address"
            placeholder="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Input
            placeholder="password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <View style={styles.buttonContainer}>
            <Button
              type="clear"
              title="Forgotten password"
              onPress={() => navigation.push(Routes.forgotPassword)}
              containerStyle={[styles.button, styles.forgotPasswordButton]}
              titleStyle={styles.forgotPasswordButtonText}
            />

            <Button title="Sign in" onPress={() => onSignIn()} containerStyle={styles.button} />

            <Button
              title="Create an account"
              onPress={() => navigation.push(Routes.signUp)}
              containerStyle={styles.button}
            />
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
    marginBottom: 32,
  },
  inputField: {
    marginTop: 16,
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
  await createMemberCard(user.userName, user.userID);
}
