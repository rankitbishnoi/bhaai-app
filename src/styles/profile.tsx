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
    fab: {
      width: 55,
      height: 55,
      position: 'absolute',
      right: 10,
      bottom: 10,
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
    button: {
      alignItems: 'center',
      backgroundColor: 'rgb(93, 95, 222)',
      borderRadius: 8,
      height: 48,
      justifyContent: 'center',
      marginVertical: 8,
    },
    buttonTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
    },
  });
}
