import {StyleSheet} from 'react-native';
import {styles} from './theme';

export default function useStyles(colorScheme: string) {
  const theme = styles[colorScheme === 'dark' ? 'dark' : 'light'];

  return StyleSheet.create({
    root: {
      backgroundColor: theme.backgroundScreen,
      flex: 1,
    },
    heading: {
      textAlign: 'center',
      color: theme.primary,
      marginBottom: 16,
    },
  });
}
