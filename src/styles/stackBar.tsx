import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    fab: {
      width: 55,
      height: 55,
    },
    stackBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
    },
  });
}
