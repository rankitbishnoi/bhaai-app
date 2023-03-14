import React, {useContext, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// Components
import SizedBox from '../components/ui/sizedBox';
import Login from '../components/auth/login';
import Signup from '../components/auth/signup';

import useStyles from '../styles/auth';
import useButtonStyles from '../styles/button';
import AppContext from '../services/storage';
import {AppContextState} from '../services/app.reducer';

const Auth: React.FC = () => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  const buttonStyles = useButtonStyles(myContext.appSettings.theme);
  const [login, setLogin] = useState(true);

  const handleToggle = () => {
    setLogin((current: any) => !current);
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <Text style={styles.title}>welcome{login ? ' Back' : ''}!</Text>

        <SizedBox height={8} />

        <Text style={styles.subtitle}>
          sign {login ? 'in' : 'up'} to your account
        </Text>

        <SizedBox height={32} />
        {login ? <Login /> : <Signup />}
        <TouchableOpacity onPress={handleToggle}>
          <View style={buttonStyles.buttonSecondary}>
            <Text style={buttonStyles.buttonTitle}>
              {login ? 'sign up' : 'login'}
            </Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <SizedBox height={60} />
    </>
  );
};

export default Auth;
