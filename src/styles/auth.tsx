import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 32,
      backgroundColor: 'rgba(230, 230, 230, 0.1)',
    },
    forgotPasswordContainer: {
      alignItems: 'flex-end',
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
    title: {
      color: '#c9b79c',
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    error: {
      color: 'red',
      marginBottom: 8,
    },
  });
}
