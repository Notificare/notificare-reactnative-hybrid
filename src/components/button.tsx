import React, { FC } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableHighlight, ViewStyle } from 'react-native';
import { Colors } from '../lib/theme';

export const Button: FC<ButtonProps> = (props) => {
  const { text, onPress, style, textStyle } = props;

  return (
    <TouchableHighlight style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableHighlight>
  );
};

interface ButtonProps {
  text?: string;
  onPress: () => void;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.outerSpace,
    borderRadius: 4,

    paddingTop: 8,
    paddingBottom: 8,
    paddingStart: 16,
    paddingEnd: 16,

    flexGrow: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
