import React, { FC, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import HeaderImage from '../assets/images/padlock.png';
import { Button } from '../components/button';
import { Colors } from '../lib/theme';

export const SignIn: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
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
          onPress={() => {}}
          style={[styles.button, styles.forgotPasswordButton]}
          textStyle={styles.forgotPasswordButtonText}
        />

        <Button text="Sign in" onPress={() => {}} style={styles.button} />

        <Button text="Create an account" onPress={() => {}} style={styles.button} />
      </View>
    </ScrollView>
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
