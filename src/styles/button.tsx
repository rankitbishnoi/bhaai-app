import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    buttonSecondary: {
      alignItems: 'center',
      backgroundColor: '#101957',
      borderRadius: 8,
      height: 48,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 4,
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#101957',
      borderRadius: 8,
      height: 48,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 4,
    },
    buttonTitle: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      width: 'auto',
      backgroundColor: '#c9b79c',
    },
    buttonGroupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    buttonGroupItemIcon: {
      color: '#fff',
      fontWeight: '600',
    },
    buttonGroupTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 32,
    },
    buttonSmall: {
      alignItems: 'center',
      width: 70,
      justifyContent: 'center',
    },
    buttonGroupDivider: {
      height: '80%',
      width: 1,
      backgroundColor: '#666',
    },
  });
}
