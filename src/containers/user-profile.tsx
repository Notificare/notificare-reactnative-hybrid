import React, { FC } from 'react';
import { NotificareUser, NotificareUserPreference } from '../lib/notificare/models';
import { Notificare } from '../lib/notificare';
import { useNetworkRequest } from '../lib/machines/network';
import { useNotificare } from '../lib/notificare/hooks';
import { Loader } from '../components/loader';
import { Image, ScrollView, StyleSheet, Switch } from 'react-native';
import md5 from 'md5';
import HeaderImage from '../assets/images/account.png';
import { ListItem } from '../components/list-item';
import { List } from '../components/list';
import { showAlertDialog } from '../lib/utils/ui';
import { useNavigation } from '@react-navigation/native';
import { ListHeader } from '../components/list-header';

export const UserProfile: FC = () => {
  const navigation = useNavigation();
  const notificare = useNotificare();
  const [profileState, profileActions] = useNetworkRequest(() => loadUserProfile(notificare), { autoStart: true });

  if (profileState.status === 'idle' || profileState.status === 'pending') {
    return <Loader />;
  }

  if (profileState.status === 'successful') {
    const { user, userPreferences } = profileState.result;

    const onNewPushEmail = async () => {
      try {
        await notificare.generateAccessToken();

        showAlertDialog('New token generated successfully.', {
          onPositiveButtonPress: () => profileActions.start(),
        });
      } catch (e) {
        showAlertDialog('Could not generate a new token.', {
          onPositiveButtonPress: () => profileActions.start(),
        });
      }
    };

    const onSignOut = async () => {
      try {
        await notificare.logout();

        navigation.goBack();
      } catch (e) {
        showAlertDialog('Could not log you out.', {
          onPositiveButtonPress: () => profileActions.start(),
        });
      }
    };

    const buildPreferenceItem = (preference: NotificareUserPreference) => {
      const index = userPreferences.indexOf(preference);

      switch (preference.preferenceType) {
        case 'choice': {
          const selectedOption = preference.preferenceOptions.find((opt) => opt.selected);
          return (
            <ListItem
              key={`preference-${index}`}
              primaryText={preference.preferenceLabel}
              trailingText={selectedOption?.segmentLabel}
            />
          );
        }
        case 'single': {
          const selectedOption = preference.preferenceOptions.find((opt) => opt.selected);
          return (
            <ListItem
              key={`preference-${index}`}
              primaryText={preference.preferenceLabel}
              trailingComponent={<Switch value={selectedOption != null} />}
            />
          );
        }
        case 'select': {
          const selectedOptions = preference.preferenceOptions.filter((opt) => opt.selected);
          return (
            <ListItem
              key={`preference-${index}`}
              primaryText={preference.preferenceLabel}
              trailingText={`${selectedOptions.length}`}
            />
          );
        }
      }

      return null;
    };

    return (
      <>
        <ScrollView>
          <List withDividers>
            <Image source={{ uri: createGravatarUrl(user.userID) }} defaultSource={HeaderImage} style={styles.avatar} />

            <ListItem primaryText="Name" trailingText={user.userName} />

            <ListItem primaryText="Email" trailingText={user.userID} />

            <ListItem primaryText="Push Email" trailingText={user.accessToken} />

            <ListItem primaryText="Open Member Card" />

            <ListItem primaryText="Change password" />

            <ListItem primaryText="New Push Email" onPress={onNewPushEmail} />

            <ListItem primaryText="Sign Out" onPress={onSignOut} style={{ primaryText: styles.signOut }} />

            <ListHeader text="User preferences" />

            {!userPreferences.length && <ListItem primaryText="You have no preferences yet." />}

            {userPreferences.length && (
              <List withDividers>{userPreferences.map((value) => buildPreferenceItem(value))}</List>
            )}
          </List>
        </ScrollView>
      </>
    );
  }

  // Failure scenario
  return null;
};

const styles = StyleSheet.create({
  avatar: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  signOut: {
    color: 'red',
  },
});

async function loadUserProfile(notificare: Notificare): Promise<UserProfile> {
  const [user, userPreferences] = await Promise.all([
    notificare.fetchAccountDetails(),
    notificare.fetchUserPreferences(),
  ]);

  return {
    user,
    userPreferences,
  };
}

interface UserProfile {
  user: NotificareUser;
  userPreferences: NotificareUserPreference[];
}

function createGravatarUrl(email: string): string {
  email = email.toLowerCase().trim();
  const hash = md5(email);
  return `https://gravatar.com/avatar/${hash}?s=512`;
}
