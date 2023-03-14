import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    container: {
      backgroundColor: 'rgba(230, 230, 230, 0.1)',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
