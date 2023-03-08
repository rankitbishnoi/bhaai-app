import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    conatiner: {
      backgroundColor: '#000000',
      flex: 1,
    },
    list: {
      backgroundColor: '#111',
      color: '#ddd',
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      color: 'rgba(235, 235, 245, 0.8)',
      fontWeight: '700',
    },
    label: {
      alignSelf: 'flex-start',
      textAlign: 'left',
      color: 'rgba(235, 235, 245, 0.8)',
      fontWeight: '700',
      fontSize: 16,
      lineHeight: 20,
    },
    labelData: {
      alignSelf: 'flex-end',
      color: 'rgba(235, 235, 245, 0.6)',
      fontWeight: '400',
      textAlign: 'right',
      fontSize: 16,
      lineHeight: 20,
    },
  });
}
