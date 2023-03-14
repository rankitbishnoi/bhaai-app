import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(230, 230, 230, 0.1)',
      color: '#111',
      paddingHorizontal: 8,
    },
    heading: {
      textAlign: 'center',
      color: '#101957',
      marginBottom: 16,
    },
    list: {
      backgroundColor: '#fff',
      color: '#111',
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
      color: '#111',
      fontWeight: '700',
    },
    label: {
      alignSelf: 'flex-start',
      textAlign: 'left',
      color: '#111',
      fontWeight: '700',
      fontSize: 16,
      lineHeight: 20,
    },
    labelData: {
      alignSelf: 'flex-end',
      color: '#101957',
      fontWeight: '400',
      textAlign: 'right',
      fontSize: 16,
      lineHeight: 20,
    },
    error: {
      color: 'red',
      marginBottom: 8,
    },
  });
}
