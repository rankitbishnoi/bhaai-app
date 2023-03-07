import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#111',
      color: '#ddd',
    },
    list: {
      backgroundColor: '#111',
      color: '#ddd',
    },
    loader: {
      width: 100,
      height: 100,
    },
    fab: {
      width: 55,
      height: 55,
      position: 'absolute',
      right: 10,
      bottom: 10,
    },
    fabLeft: {
      width: 55,
      height: 55,
      position: 'absolute',
      left: 10,
      bottom: 10,
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
      color: 'rgba(235, 235, 245, 0.6)',
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      width: 80,
    },
    subtitle: {
      color: 'rgba(235, 235, 245, 0.6)',
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
    },
    textButton: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
    },
    textInput: {
      color: '#FFFFFF',
      flex: 1,
    },
  });
}
