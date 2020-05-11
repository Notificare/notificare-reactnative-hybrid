import React, { Component, FC } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableHighlight, View } from 'react-native';
import { Colors } from '../lib/theme';

export const ListItem: FC<ListItemProps> = (props) => {
  const { primaryText, secondaryText, trailingText, trailingComponent, onPress, style } = props;

  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.leading}>
          <Text style={[styles.primaryText, style?.primaryText]}>{primaryText}</Text>

          {secondaryText && <Text style={styles.secondaryText}>{secondaryText}</Text>}
        </View>

        {(trailingComponent || trailingText) && (
          <View style={styles.trailing}>
            {trailingComponent}
            {trailingComponent == null && <Text style={styles.trailingText}>{trailingText}</Text>}
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
};

interface ListItemProps {
  primaryText: string | null;
  secondaryText?: string | null;

  trailingText?: string | null;
  trailingComponent?: Component;

  onPress?: () => void;

  style?: {
    primaryText?: StyleProp<TextStyle>;
  };
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
  },
  leading: {
    flex: 1,
  },
  trailing: {
    marginStart: 16,
  },
  primaryText: {
    color: Colors.blackHighEmphasis,
    fontSize: 14,
    fontWeight: 'normal',
  },
  secondaryText: {
    color: Colors.blackMediumEmphasis,
    fontSize: 12,
    fontWeight: 'normal',
  },
  trailingText: {
    color: Colors.blackMediumEmphasis,
    fontSize: 12,
    fontWeight: '300',
  },
  trailingComponent: {},
});
