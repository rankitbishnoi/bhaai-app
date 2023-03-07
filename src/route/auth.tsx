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

const Auth: React.FC = () => {
  const styles = useStyles();
  const [login, setLogin] = useState(true);

  const handleToggle = () => {
    setLogin((current: any) => !current);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.content}>
      <Text style={styles.title}>Welcome{login ? ' Back' : ''}!</Text>

      <SizedBox height={8} />

      <Text style={styles.subtitle}>
        Sign {login ? 'in' : 'up'} to your account
      </Text>

      <SizedBox height={32} />
      {login ? <Login /> : <Signup />}
      <SizedBox height={16} />
      <TouchableOpacity onPress={handleToggle}>
        <View style={styles.buttonSecondary}>
          <Text style={styles.buttonTitle}>{login ? 'Sign up' : 'login'}</Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Auth;
