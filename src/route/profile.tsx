import React, {useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import mmkv from '../services/mmkv';
import AppContext from '../services/storage';

import useStyles from '../styles/root';

const Profile: React.FC = () => {
  const styles = useStyles();
  const myContext = useContext(AppContext);

  const logout = () => {
    mmkv.deleteJWT();
    myContext.setAppSettings({isLoggedIn: false});
  };

  return (
    <View style={{...styles.content, ...styles.root}}>
      <TouchableOpacity onPress={logout}>
        <View style={styles.button}>
          <Text style={styles.buttonTitle}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
