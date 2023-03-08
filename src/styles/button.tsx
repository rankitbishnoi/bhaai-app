import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    buttonSecondary: {
      alignItems: 'center',
      backgroundColor: 'rgb(93, 95, 222)',
      borderRadius: 8,
      height: 48,
      justifyContent: 'center',
      marginVertical: 8,
    },
    button: {
      alignItems: 'center',
      backgroundColor: 'rgb(0, 100, 100)',
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
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      width: 'auto',
      backgroundColor: 'rgb(0, 100, 100)',
    },
    buttonGroupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    buttonGroupItemIcon: {
      color: '#ffffff',
      fontWeight: '600',
    },
    buttonGroupTitle: {
      color: '#FFFFFF',
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
      backgroundColor: '#cccccc',
    },
  });
}
