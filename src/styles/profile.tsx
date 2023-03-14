import {StyleSheet} from 'react-native';
import {styles} from './theme';

export default function useStyles(colorScheme: string) {
  const theme = styles[colorScheme === 'dark' ? 'dark' : 'light'];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundScreen,
      color: theme.frontColor,
      paddingHorizontal: 8,
    },
    heading: {
      textAlign: 'center',
      color: theme.primary,
      marginBottom: 16,
    },
    list: {
      backgroundColor: theme.backgroundSecondary,
      color: theme.frontColor,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
      color: theme.frontColor,
      fontWeight: '700',
    },
    label: {
      alignSelf: 'flex-start',
      textAlign: 'left',
      color: theme.frontColor,
      fontWeight: '700',
      fontSize: 16,
      lineHeight: 20,
    },
    labelData: {
      alignSelf: 'flex-end',
      color: theme.primary,
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
