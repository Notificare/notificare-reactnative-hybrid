import React, { FC, useState } from 'react';
import { ChangePasswordProps } from '../routes';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNotificare } from '../lib/notificare/hooks';
import { useNetworkRequest } from '../lib/machines/network';
import { showAlertDialog } from '../lib/utils/ui';
import { Loader } from '../components/loader';

export const ChangePassword: FC<ChangePasswordProps> = ({ navigation }) => {
  const notificare = useNotificare();
  const [passwordField, setPasswordField] = useState<FormField>({ value: '' });
  const [passwordConfirmationField, setPasswordConfirmationField] = useState<FormField>({ value: '' });

  const [changePasswordState, changePasswordActions] = useNetworkRequest(() =>
    notificare.changePassword(passwordField.value),
  );

  const onChangePassword = async () => {
    try {
      if (!passwordField.value.trim().length) {
        return setPasswordField((prevState) => ({ ...prevState, errorMessage: 'Please fill in a new password.' }));
      }

      if (passwordField.value.length < 6) {
        return setPasswordField((prevState) => ({ ...prevState, errorMessage: 'The password is too short.' }));
      }

      if (passwordField.value !== passwordConfirmationField.value) {
        return setPasswordConfirmationField((prevState) => ({
          ...prevState,
          errorMessage: 'The confirmation does not match with the password.',
        }));
      }

      await changePasswordActions.start();
      showAlertDialog('Password changed successfully.', { onPositiveButtonPress: () => navigation.goBack() });
    } catch (e) {
      console.log(`Failed to change the password: ${e}`);
      showAlertDialog('Could not change your password.');
    }
  };

  return (
    <>
      {changePasswordState.status === 'pending' && <Loader />}

      {(changePasswordState.status === 'idle' || changePasswordState.status === 'failed') && (
        <ScrollView contentContainerStyle={styles.container}>
          <Input
            placeholder="New password"
            secureTextEntry={true}
            leftIcon={{ type: 'material', name: 'lock' }}
            containerStyle={styles.bottomGap}
            value={passwordField.value}
            errorMessage={passwordField.errorMessage}
            errorStyle={!passwordField.errorMessage ? styles.formErrorHidden : undefined}
            onChangeText={(text) => setPasswordField({ value: text })}
          />

          <Input
            placeholder="Confirm new password"
            secureTextEntry={true}
            leftIcon={{ type: 'material', name: 'lock' }}
            containerStyle={styles.bottomGap}
            value={passwordConfirmationField.value}
            errorMessage={passwordConfirmationField.errorMessage}
            errorStyle={!passwordConfirmationField.errorMessage ? styles.formErrorHidden : undefined}
            onChangeText={(text) => setPasswordConfirmationField({ value: text })}
          />

          <Button title="Change password" onPress={onChangePassword} />
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  bottomGap: {
    marginBottom: 16,
  },
  formErrorHidden: {
    display: 'none',
  },
});

interface FormField {
  value: string;
  errorMessage?: string;
}
