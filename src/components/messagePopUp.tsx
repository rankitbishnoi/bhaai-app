import {Snackbar} from '@react-native-material/core';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStyles from '../styles/messagePopUp';

interface MessagePopUpOptions {
  message: string;
  setVisible: (visible: boolean) => any;
}

const MessagePopUp: React.FC<MessagePopUpOptions> = ({message, setVisible}) => {
  const styles = useStyles();

  return (
    <Snackbar
      message={message}
      action={
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Ionicons name="close" />
        </TouchableOpacity>
      }
      style={styles.container}
    />
  );
};

export default MessagePopUp;
