import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    root: {
      backgroundColor: '#ffffff',
      flex: 1,
    },
    heading: {
      textAlign: 'center',
      color: '#101957',
      marginBottom: 16,
    },
  });
}
