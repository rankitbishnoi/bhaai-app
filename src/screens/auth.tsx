import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// Components
import SizedBox from '../components/SizedBox';
import Login from '../components/login';
import Signup from '../components/signup';

import useStyles from '../styles/auth';
import useButtonStyles from '../styles/button';

const Auth: React.FC = () => {
  const styles = useStyles();
  const buttonStyles = useButtonStyles();
  const [login, setLogin] = useState(true);

  const handleToggle = () => {
    setLogin((current: any) => !current);
  };
  return (
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
  );
};

export default Auth;
