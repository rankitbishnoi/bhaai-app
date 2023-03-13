import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    root: {
      backgroundColor: '#000000',
      flex: 1,
    },
    heading: {
      textAlign: 'center',
      color: 'rgb(93, 95, 222)',
      marginBottom: 16,
    },
  });
}
