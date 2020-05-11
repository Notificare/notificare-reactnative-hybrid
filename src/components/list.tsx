import React, { FC, Fragment, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../lib/theme';

export const List: FC<ListProps> = (props) => {
  const { withDividers, children } = props;

  return (
    <View style={styles.list}>
      {children.map((value, index) => (
        <Fragment key={index}>
          {value}
          {withDividers && <View style={styles.divider} />}
        </Fragment>
      ))}
    </View>
  );
};

interface ListProps {
  withDividers?: boolean;
  children: ReactElement[];
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.divider,
  },
});
