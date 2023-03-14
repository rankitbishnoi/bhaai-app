import {StyleSheet} from 'react-native';
import {styles} from './theme';

export default function useStyles(colorScheme: string) {
  const theme = styles[colorScheme === 'dark' ? 'dark' : 'light'];

  return StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundScreen,
      flex: 1,
      color: theme.frontColor,
      paddingHorizontal: 8,
    },
    list: {
      backgroundColor: theme.backgroundSecondary,
      color: theme.frontColor,
    },
    noItems: {
      color: theme.frontColorInvert,
      fontSize: 14,
      fontWeight: 'bold',
      position: 'absolute',
      alignSelf: 'center',
      textAlign: 'center',
      top: '50%',
    },
    loader: {
      width: 1000,
      height: 1000,
      zIndex: 999,
      position: 'absolute',
      right: 50,
      bottom: 50,
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
