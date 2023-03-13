import {Snackbar} from '@react-native-material/core';
import React, {useContext, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';
import AppContext from '../services/storage';
import useStyles from '../styles/messagePopUp';
import {MessagePopUpInterface} from '../types/MessagePopUp';

interface MessagePopUpOptions {}

const MessagePopUp: React.FC<MessagePopUpOptions> = ({}) => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles();

  useEffect(() => {
    const interval = setInterval(() => {
      myContext.appSettings.messages.map((data: MessagePopUpInterface) => {
        if (data.id < Date.now() - 3000) {
          myContext.dispatch({
            type: APP_ACTIONS.REMOVE_MESSAGE,
            payload: data.id,
          });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [myContext]);

  return (
    <>
      {myContext.appSettings.messages.map((data: MessagePopUpInterface) => {
        return (
          <Snackbar
            key={data.id}
            message={data.message}
            action={
              <TouchableOpacity
                onPress={() =>
                  myContext.dispatch({
                    type: APP_ACTIONS.REMOVE_MESSAGE,
                    payload: data.id,
                  })
                }>
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
