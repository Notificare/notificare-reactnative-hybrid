import React, { FC, Fragment, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../lib/theme';

export const List: FC<ListProps> = (props) => {
  const { withDividers, withLastDivider, children } = props;

  return (
    <View style={styles.list}>
      {children.map((value, index, array) => {
        const isLastDivider = index == array.length - 1;
        const includeLastDivider = isLastDivider && withLastDivider;

        return (
          <Fragment key={index}>
            {value}
            {value && withDividers && (!isLastDivider || includeLastDivider) && <View style={styles.divider} />}
          </Fragment>
        );
      })}
    </View>
  );
};

interface ListProps {
  withDividers?: boolean;
  withLastDivider?: boolean;
  children: ReactNode[];
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
