import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    container: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#101957',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selected: {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: '#101957',
    },
  });
}
