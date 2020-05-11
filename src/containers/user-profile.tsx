import React, { FC } from 'react';
import { NotificareUser, NotificareUserPreference } from '../lib/notificare/models';
import { Notificare } from '../lib/notificare';
import { useNetworkRequest } from '../lib/machines/network';
import { useNotificare } from '../lib/notificare/hooks';
import { Loader } from '../components/loader';
import { Image, StyleSheet } from 'react-native';
import md5 from 'md5';
import HeaderImage from '../assets/images/account.png';
import { ListItem } from '../components/ListItem';
import { List } from '../components/List';
import { showAlertDialog } from '../lib/utils/ui';

export const UserProfile: FC = () => {
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

    return (
      <>
        <List withDividers>
          <Image source={{ uri: createGravatarUrl(user.userID) }} defaultSource={HeaderImage} style={styles.avatar} />

          <ListItem primaryText="Name" trailingText={user.userName} />

          <ListItem primaryText="Email" trailingText={user.userID} />

          <ListItem primaryText="Push Email" trailingText={user.accessToken} />

          <ListItem primaryText="Open Member Card" />

          <ListItem primaryText="Change password" />

          <ListItem primaryText="New Push Email" onPress={onNewPushEmail} />

          <ListItem primaryText="Sign Out" />
        </List>
      </>
    );
  }

  // Failure scenario
  return null;
};

const styles = StyleSheet.create({
  avatar: {
    width: '100%',
    height: '100%',
    maxHeight: 300,
    resizeMode: 'cover',
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
