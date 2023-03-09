import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    root: {
      backgroundColor: '#000000',
      flex: 1,
    },
    safeAreaView: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 32,
    },
    list: {
      backgroundColor: '#000',
      color: '#ddd',
    },
  });
}
