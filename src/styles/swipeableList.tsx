import {StyleSheet} from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    container: {
      backgroundColor: '#111',
      flex: 1,
    },
    backTextWhite: {
      color: '#FFF',
    },
    rowFront: {
      backgroundColor: '#111',
      borderRadius: 5,
      margin: 5,
      marginBottom: 5,
      shadowColor: '#999',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    rowFrontVisible: {
      backgroundColor: '#111',
      borderRadius: 5,
      padding: 0,
    },
    rowBack: {
      alignItems: 'center',
      backgroundColor: '#111',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
      margin: 5,
      marginBottom: 5,
      borderRadius: 5,
    },
    backRightBtn: {
      alignItems: 'flex-end',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
      paddingRight: 17,
    },
    backRightBtnLeft: {
      backgroundColor: 'rgb(93, 95, 222)',
      right: 75,
    },
    backRightBtnRight: {
      backgroundColor: 'red',
      right: 0,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    trash: {
      height: 25,
      width: 25,
      marginRight: 7,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#666',
    },
    details: {
      fontSize: 12,
      color: '#999',
    },
    list: {
      backgroundColor: '#000',
      color: '#ddd',
    },
  });
}
