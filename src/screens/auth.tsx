import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
// Components
import SizedBox from '../components/ui/sizedBox';
import Login from '../components/auth/login';
import Signup from '../components/auth/signup';

import useStyles from '../styles/auth';
import useStackBarStyles from '../styles/stackBar';
import useButtonStyles from '../styles/button';
import {Stack, Text} from '@react-native-material/core';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {themeColor, toggleTheme} from '../redux/features/slices/theme-slice';

const Auth: React.FC = () => {
  const theme = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
  const styles = useStyles(theme);
  const stackBarStyles = useStackBarStyles(theme);
  const buttonStyles = useButtonStyles(theme);
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
      <Stack style={stackBarStyles.stackBarBottom} fill top={8} spacing={0}>
        <View style={stackBarStyles.fab} />
        <Pressable
          onPress={() => dispatch(toggleTheme())}
          style={stackBarStyles.fab}>
          <Text variant="button">
            {`${
              theme === themeColor.LIGHT ? themeColor.DARK : themeColor.LIGHT
            } mode`}
          </Text>
        </Pressable>
      </Stack>
    </>
  );
};

export default Auth;
