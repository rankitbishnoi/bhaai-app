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
    list: {
      backgroundColor: theme.backgroundSecondary,
      color: theme.frontColor,
    },
    loader: {
      width: 100,
      height: 100,
    },
    heading: {
      textAlign: 'center',
      color: theme.primary,
      marginBottom: 16,
    },
    form: {
      alignItems: 'center',
      backgroundColor: 'rgb(58, 58, 60)',
      borderRadius: 8,
      flexDirection: 'row',
      height: 48,
      paddingHorizontal: 16,
    },
    label: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      width: 80,
    },
    subtitle: {
      color: theme.primary,
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
    },
    textButton: {
      color: theme.frontColor,
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
    },
    textInput: {
      color: theme.frontColor,
      marginBottom: 16,
    },
    sortFilter: {
      width: 140,
      height: 32,
    },
    error: {
      color: 'red',
      marginBottom: 8,
    },
  });
}
