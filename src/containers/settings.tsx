import React, { FC, useState } from 'react';
import { SettingsProps } from '../routes';
import { List } from '../components/list';
import { ListHeader } from '../components/list-header';
import { ListItem } from '../components/list-item';
import { ScrollView, Switch } from 'react-native';
import { useNotificare } from '../lib/notificare/hooks';
import { getDemoSourceConfig } from '../lib/utils/storage';
import { useNetworkRequest } from '../lib/machines/network';
import { Loader } from '../components/loader';
import { NotificareDeviceDnD } from '../lib/notificare/models';
import { Icon } from 'react-native-elements';
import { getVersion } from 'react-native-device-info';
import Mailer from 'react-native-mail';

export const Settings: FC<SettingsProps> = () => {
  const notificare = useNotificare();
  const [request] = useNetworkRequest(() => loadData(), {
    autoStart: true,
    onStarted: () => setLoading(true),
    onFinished: async (state) => {
      setLoading(false);

      if (state.status !== 'successful') return;
      const { result } = state;

      setSwitches({
        notifications: result.isRemoteNotificationsEnabled,
        location: result.isLocationServicesEnabled,
        dnd: result.dnd?.start != null && result.dnd?.end != null,
        tagPress: result.tags.includes('tag_press'),
        tagNewsletter: result.tags.includes('tag_newsletter'),
        tagEvents: result.tags.includes('tag_events'),
      });
    },
  });

  const [loading, setLoading] = useState(false);
  const [switches, setSwitches] = useState<Switches>({
    notifications: false,
    location: false,
    dnd: false,
    tagPress: false,
    tagNewsletter: false,
    tagEvents: false,
  });

  const loadData = async () => {
    const demoSourceConfig = await getDemoSourceConfig();

    const isRemoteNotificationsEnabled = await notificare.isRemoteNotificationsEnabled();
    const useDoNotDisturb = isRemoteNotificationsEnabled && (await notificare.isAllowedUIEnabled());

    const result: SettingsData = {
      useLocationServices: demoSourceConfig?.config?.useLocationServices ?? false,
      useDoNotDisturb,
      isRemoteNotificationsEnabled,
      isLocationServicesEnabled: await notificare.isLocationServicesEnabled(),
      dnd: useDoNotDisturb ? await notificare.fetchDoNotDisturb() : undefined,
      tags: await notificare.fetchTags(),
    };

    return result;
  };

  const sendFeedback = async () => {
    const demoSourceConfig = await getDemoSourceConfig();
    if (demoSourceConfig == null) return;

    const recipients = demoSourceConfig.email.split(',');

    Mailer.mail(
      {
        // @ts-ignore
        recipients: recipients,
        subject: `your_subject`,
        body: 'your_message',
        isHTML: false,
      },
      (error, _) => {
        if (error) {
          console.log(`Could not open the email client: ${error}`);
        }
      },
    );
  };

  const updateTag = async (prop: 'tagPress' | 'tagNewsletter' | 'tagEvents', tag: string, enabled: boolean) => {
    setSwitches((prevState) => ({ ...prevState, [prop]: enabled }));
    setLoading(true);

    try {
      if (enabled) {
        await notificare.addTag(tag);
      } else {
        await notificare.removeTag(tag);
      }
    } catch (e) {
      console.log(`Failed to update tag: ${e}`);
      setSwitches((prevState) => ({ ...prevState, [prop]: !enabled }));
    }
  };

  return (
    <>
      {loading && <Loader />}

      {request.status === 'successful' && (
        <ScrollView>
          <List withDividers withLastDivider>
            <ListHeader text="Notification Settings" />

            <ListItem
              primaryText="Notifications"
              secondaryText="Receive messages with our news, events or any other campaign we might find relevant for you"
              trailingComponent={<Switch value={switches.notifications} />}
            />

            {request.result.useLocationServices && (
              <ListItem
                primaryText="Location Services"
                secondaryText="Allow us to collect your location data in order to send notifications whenever you are around"
                trailingComponent={<Switch value={switches.location} />}
              />
            )}

            {request.result.useDoNotDisturb && (
              <>
                <ListItem
                  primaryText="Do Not Disturb"
                  secondaryText="Configure a period of time where notifications will not generate alerts in the notification center"
                  trailingComponent={<Switch value={switches.dnd} />}
                />

                {request.result.dnd?.start != null && request.result.dnd?.end != null && (
                  <>
                    <ListItem primaryText="From" trailingText={request.result.dnd.start} />

                    <ListItem primaryText="To" trailingText={request.result.dnd.end} />
                  </>
                )}
              </>
            )}

            <ListHeader text="Tags" />

            <ListItem
              primaryText="Press"
              secondaryText="Subscribe me to the group of devices that would like to receive all the news via push notifications"
              trailingComponent={
                <Switch
                  value={switches.tagPress}
                  onValueChange={(value) => updateTag('tagPress', 'tag_press', value)}
                />
              }
            />

            <ListItem
              primaryText="Newsletter"
              secondaryText="Subscribe me to the group of devices that would like to receive your newsletter"
              trailingComponent={
                <Switch
                  value={switches.tagNewsletter}
                  onValueChange={(value) => updateTag('tagNewsletter', 'tag_newsletter', value)}
                />
              }
            />

            <ListItem
              primaryText="Events"
              secondaryText="Subscribe me to the group of devices that would like to receive all the events via push notifications"
              trailingComponent={
                <Switch
                  value={switches.tagEvents}
                  onValueChange={(value) => updateTag('tagEvents', 'tag_events', value)}
                />
              }
            />

            <ListHeader text="About this app" />

            <ListItem
              primaryText="Leave your feedback"
              trailingComponent={<Icon type="material" name="keyboard-arrow-right" />}
              onPress={() => sendFeedback()}
            />

            <ListItem primaryText="App version" trailingText={getVersion()} />
          </List>
        </ScrollView>
      )}
    </>
  );
};

interface SettingsData {
  useLocationServices: boolean;
  useDoNotDisturb: boolean;
  isRemoteNotificationsEnabled: boolean;
  isLocationServicesEnabled: boolean;
  dnd?: NotificareDeviceDnD;
  tags: string[];
}

interface Switches {
  notifications: boolean;
  location: boolean;
  dnd: boolean;
  tagPress: boolean;
  tagNewsletter: boolean;
  tagEvents: boolean;
}
