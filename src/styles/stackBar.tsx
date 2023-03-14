import {StyleSheet} from 'react-native';

export default function useStyles() {
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
      color: '#101957',
      width: 100,
      height: 30,
      lineHeight: 30,
    },
    divider: {
      marginVertical: 8,
    },
    background: {
      backgroundColor: '#fff',
    },
  });
}
