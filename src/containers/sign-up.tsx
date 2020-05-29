import React, { FC, useState } from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
import HeaderImage from '../assets/images/account.png';
import { Colors } from '../lib/theme';
import { useNotificare } from '../lib/notificare/hooks';
import { showAlertDialog } from '../lib/utils/ui';
import { useNetworkRequest } from '../lib/machines/network';
import { Notificare } from '../lib/notificare';
import { Loader } from '../components/loader';
import { SignUpProps } from '../routes';
import { Button, Input } from 'react-native-elements';

export const SignUp: FC<SignUpProps> = ({ navigation }) => {
  const notificare = useNotificare();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [state, signUpActions] = useNetworkRequest(() => performSignUp(notificare, name, email, password));

  const onSignUp = async () => {
    if (!name.trim().length || !email.trim().length || !password.trim().length || !passwordConfirmation.trim().length) {
      return showAlertDialog('Please fill in all fields.');
    }

    if (!email.includes('@')) {
      return showAlertDialog('Invalid email address.');
    }

    if (password.length < 6) {
      return showAlertDialog('Password is too short.');
    }

    if (password !== passwordConfirmation) {
      return showAlertDialog('Passwords do not match. Please confirm the same password twice.');
    }

    try {
      // Run the sign in procedure.
      await signUpActions.start();

      showAlertDialog('Account created successfully. You can now sign in.', {
        onPositiveButtonPress: () => navigation.goBack(),
      });
    } catch (e) {
      showAlertDialog(e.message);
    }
  };

  return (
    <>
      {state.status === 'pending' && <Loader />}

      {(state.status === 'idle' || state.status === 'failed') && (
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={HeaderImage} style={styles.headerImage} />

          <Input
            keyboardType={'name-phone-pad'}
            placeholder="name"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <Input
            keyboardType={'email-address'}
            placeholder="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Input
            secureTextEntry={true}
            placeholder="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <Input
            secureTextEntry={true}
            placeholder="password confirmation"
            value={passwordConfirmation}
            onChangeText={(text) => setPasswordConfirmation(text)}
          />

          <Button title="Create an account" onPress={() => onSignUp()} containerStyle={styles.button} />
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
  forgotPasswordButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  forgotPasswordButtonText: {
    color: Colors.grey,
  },
});

async function performSignUp(notificare: Notificare, name: string, email: string, password: string): Promise<void> {
  console.log(`email: ${email}`);
  await notificare.createAccount(name, email, password);

  // Create and update the current member card
  // todo await createMemberCard(name, email);
}
