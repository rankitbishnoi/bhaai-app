import {StyleSheet} from 'react-native';
import {styles} from './theme';

export default function useStyles(colorScheme: string) {
  const theme = styles[colorScheme === 'dark' ? 'dark' : 'light'];

  return StyleSheet.create({
    buttonSecondary: {
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 8,
      height: 48,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 4,
    },
    button: {
      alignItems: 'center',
      backgroundColor: theme.primary,
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
      backgroundColor: theme.secondary,
    },
    buttonGroupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    buttonGroupItemIcon: {
      color: theme.frontColor,
      fontWeight: '600',
    },
    buttonGroupTitle: {
      color: theme.frontColor,
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
      backgroundColor: theme.frontColorInvert,
    },
  });
}
