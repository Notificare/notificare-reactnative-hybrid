import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../lib/theme';

export const ListHeader: FC<ListHeaderProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text.toUpperCase()}</Text>
    </View>
  );
};

interface ListHeaderProps {
  text: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.wildSand,
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  text: {
    color: Colors.blackHighEmphasis,
    fontSize: 16,
    fontWeight: 'normal',
  },
});
