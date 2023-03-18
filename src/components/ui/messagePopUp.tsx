import {Snackbar} from '@react-native-material/core';
import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {deletedMessages} from '../../redux/features/slices/message-slice';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import useStyles from '../../styles/messagePopUp';
import {MessagePopUpInterface} from '../../types/MessagePopUp';

interface MessagePopUpOptions {}

const MessagePopUp: React.FC<MessagePopUpOptions> = ({}) => {
  const messages = useAppSelector(state => state.message.messages);
  const dispatch = useAppDispatch();
  const styles = useStyles();

  useEffect(() => {
    const interval = setInterval(() => {
      messages.map((data: MessagePopUpInterface) => {
        if (data.id < Date.now() - 3000) {
          dispatch(deletedMessages(data.id));
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [messages, dispatch]);

  return (
    <>
      {messages.map((data: MessagePopUpInterface) => {
        return (
          <Snackbar
            key={data.id}
            message={data.message}
            action={
              <TouchableOpacity
                onPress={() => dispatch(deletedMessages(data.id))}>
                <Ionicons name="close" />
              </TouchableOpacity>
            }
            style={styles.container}
          />
        );
      })}
    </>
  );
};

export default MessagePopUp;
