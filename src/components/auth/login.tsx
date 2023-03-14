import React, {useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {apiService} from '../../services/api.service';
import AppContext from '../../services/storage';
import useStyles from '../../styles/auth';
import SizedBox from '../ui/sizedBox';
import useButtonStyles from '../../styles/button';
import {TextInput} from '@react-native-material/core';
import {validateEmail} from '../../services/helpers';
import {AppContextState, APP_ACTIONS} from '../../services/app.reducer';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC<{}> = ({}) => {
  const myContext = useContext<AppContextState>(AppContext);
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(({email, password}) => {
    apiService
      .login({
        email,
        password,
      })
      .catch(error => {
        myContext.dispatch({
          type: APP_ACTIONS.NEW_MESSAGE,
          payload: error.response.data?.message || 'Unable to Login',
        });
        return {access_token: ''};
      })
      .then(result => {
        if (result.access_token.length) {
          myContext.dispatch({
            type: APP_ACTIONS.LOGIN,
            payload: result.access_token,
          });
        }
      });
  });

  const styles = useStyles();
  const buttonStyles = useButtonStyles();

  return (
    <>
      <Pressable onPress={() => setFocus('email')}>
        {errors.email && (
          <Text style={styles.error}>{errors.email?.message}</Text>
        )}
        <Controller
          control={control}
          name="email"
          render={({field}) => (
            <TextInput
              {...field}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              style={styles.textInput}
              textContentType="username"
              {...register('email', {
                required: 'email is required',
                validate: value => {
                  return validateEmail(value)
                    ? undefined
                    : 'please enter valid email';
                },
              })}
              onSubmitEditing={() => setFocus('password')}
              variant="outlined"
              label="email"
              onChangeText={value => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </Pressable>
      <Pressable onPress={() => setFocus('password')}>
        {errors.password && (
          <Text style={styles.error}>{errors.password?.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({field}) => (
            <TextInput
              {...field}
              {...register('password', {required: 'password is required'})}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              onSubmitEditing={onSubmit}
              returnKeyType="done"
              secureTextEntry
              style={styles.textInput}
              textContentType="password"
              variant="outlined"
              label="password"
              onChangeText={value => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </Pressable>
      <SizedBox height={16} />
      <TouchableOpacity onPress={onSubmit}>
        <View style={buttonStyles.button}>
          <Text style={buttonStyles.buttonTitle}>continue</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default Login;
