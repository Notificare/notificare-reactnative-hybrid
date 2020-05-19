import React, { FC, useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import { UserProfilePreferencePickerProps } from '../routes';
import { List } from '../components/list';
import { ListItem } from '../components/list-item';
import { useNotificare } from '../lib/notificare/hooks';
import { NotificareUserPreference, NotificareUserPreferenceOption } from '../lib/notificare/models';
import { Icon } from 'react-native-elements';

export const UserProfilePreferencePicker: FC<UserProfilePreferencePickerProps> = ({ navigation, route }) => {
  const { preference } = route.params;

  const notificare = useNotificare();
  const [selectedChoice, setSelectedChoice] = useState(preference.preferenceOptions.find((option) => option.selected));
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>(
    createDefaultSelectionState(preference),
  );

  const buildListItem = (option: NotificareUserPreferenceOption, index: number) => {
    switch (preference.preferenceType) {
      case 'choice': {
        return (
          <ListItem
            key={index}
            primaryText={option.segmentLabel}
            trailingComponent={
              option.segmentId === selectedChoice?.segmentId ? (
                <Icon type="material" name="check-circle" color="#4BB543" />
              ) : undefined
            }
            onPress={() => {
              setSelectedChoice(option);
              notificare
                .addSegmentToUserPreference(
                  {
                    segmentId: option.segmentId,
                    segmentLabel: option.segmentLabel,
                  },
                  preference,
                )
                .then(() => navigation.goBack())
                .catch((e) => console.log(`Failed to add segment to user preference: ${e}`));
            }}
          />
        );
      }
      case 'select': {
        return (
          <ListItem
            key={index}
            primaryText={option.segmentLabel}
            trailingComponent={
              <Switch
                value={selectedOptions[option.segmentId]}
                onValueChange={(selected) => {
                  setSelectedOptions((prevState) => ({ ...prevState, [option.segmentId]: selected }));

                  if (selected) {
                    notificare
                      .addSegmentToUserPreference(
                        {
                          segmentId: option.segmentId,
                          segmentLabel: option.segmentLabel,
                        },
                        preference,
                      )
                      .catch((e) => console.log(`Failed to add segment to user preference: ${e}`));
                  } else {
                    notificare
                      .removeSegmentFromUserPreference(
                        {
                          segmentId: option.segmentId,
                          segmentLabel: option.segmentLabel,
                        },
                        preference,
                      )
                      .catch((e) => console.log(`Failed to add segment to user preference: ${e}`));
                  }
                }}
              />
            }
          />
        );
      }
      default:
        return undefined;
    }
  };

  return (
    <ScrollView>
      <List withDividers>{preference.preferenceOptions.map(buildListItem)}</List>
    </ScrollView>
  );
};

function createDefaultSelectionState(preference: NotificareUserPreference): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  preference.preferenceOptions.forEach((option) => (result[option.segmentId] = option.selected));
  return result;
}
