import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    container: {
      backgroundColor: 'rgba(230, 230, 230, 0.1)',
      flex: 1,
      color: '#111',
      paddingHorizontal: 8,
    },
    list: {
      backgroundColor: '#fff',
      color: '#111',
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
      color: '#101957',
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
      color: '#101957',
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      width: 80,
    },
    subtitle: {
      color: '#101957',
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
    },
    textButton: {
      color: '#111',
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
    },
    textInput: {
      color: '#111',
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
