import {StyleSheet} from 'react-native';
import {styles} from './theme';

export default function useStyles(colorScheme: string) {
  const theme = styles[colorScheme === 'dark' ? 'dark' : 'light'];

  return StyleSheet.create({
    fab: {
      width: 55,
      height: 55,
    },
    empty: {
      width: 55,
    },
    left: {
      alignSelf: 'flex-end',
    },
    stackBarBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      width: '100%',
    },
    stackBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      alignContent: 'center',
      width: '100%',
    },
    stackBarHeadings: {
      textAlign: 'center',
      color: theme.primary,
      width: 100,
      height: 30,
      lineHeight: 30,
    },
    divider: {
      marginVertical: 8,
    },
    background: {
      backgroundColor: theme.backgroundScreen,
    },
    iconColor: {
      color: theme.primary,
    },
    toggleColor: {
      thumb: theme.frontColor,
      active: theme.primary,
      inactive: theme.primaryBlur,
    } as any,
    popUp: {
      back: theme.popupBackground,
      front: theme.popupFront,
    } as any,
  });
}
