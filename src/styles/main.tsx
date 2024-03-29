import {StyleSheet} from 'react-native';
import {styles} from './theme';

export default function useStyles(colorScheme: string) {
  const theme = styles[colorScheme === 'dark' ? 'dark' : 'light'];

  return StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundScreen,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabBarStyle: {
      backgroundColor: theme.tertiary,
      active: theme.primary,
      inactive: theme.primaryBlur,
    },
    root: {
      backgroundColor: theme.backgroundScreen,
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
      backgroundColor: theme.backgroundSecondary,
      color: theme.frontColor,
    },
  });
}
