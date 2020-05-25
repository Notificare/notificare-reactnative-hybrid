import { StyleSheet } from 'react-native';

export const Colors = {
  wildSand: '#F6F6F6',
  outerSpace: '#232C2A',
  grey: '#888888',
  divider: '#DCDCDC',
  blackHighEmphasis: 'rgba(0, 0, 0, 0.87)',
  blackMediumEmphasis: 'rgba(0, 0, 0, 0.60)',
  error: '#B00020',
};

export const Typography = StyleSheet.create({
  body2: {
    color: Colors.blackHighEmphasis,
    fontSize: 14,
    fontWeight: 'normal',
  },
  caption: {
    color: Colors.blackMediumEmphasis,
    fontSize: 12,
    fontWeight: 'normal',
  },
});
