import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {apiService} from '../../services/api.service';
import useStyles from '../../styles/auth';
import SizedBox from '../ui/sizedBox';
import useButtonStyles from '../../styles/button';
import {TextInput} from '@react-native-material/core';
import {validateEmail} from '../../services/helpers';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {login} from '../../redux/features/slices/profile-slice';
import {createdMessages} from '../../redux/features/slices/message-slice';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC<{}> = ({}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
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
        dispatch(
          createdMessages(error.response.data?.message || 'Unable to Login'),
        );
        return {access_token: ''};
      })
      .then(result => {
        if (result.access_token.length) {
          dispatch(login(result.access_token));
        }
      });
  });

  const styles = useStyles(theme);
  const buttonStyles = useButtonStyles(theme);

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
