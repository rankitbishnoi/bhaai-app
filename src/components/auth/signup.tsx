import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {apiService} from '../../services/api.service';
import useStyles from '../../styles/auth';

import useButtonStyles from '../../styles/button';
import {TextInput} from '@react-native-material/core';
import {validateEmail, validatePhoneNumber} from '../../services/helpers';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {login, loginthunk} from '../../redux/features/slices/profile-slice';
import {createdMessages} from '../../redux/features/slices/message-slice';

interface FormData {
  email: string;
  phoneNumber: string;
  password: string;
  cpassword: string;
}

const Signup: React.FC<{}> = ({}) => {
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
      cpassword: '',
      phoneNumber: '+91',
    },
  });

  const onSubmit = handleSubmit(({email, password}) => {
    apiService
      .signup({
        email,
        password,
      })
      .catch(error => {
        dispatch(
          createdMessages(error.response.data?.message || 'Unable to SignUp'),
        );
        return {access_token: ''};
      })
      .then(data => {
        if (data) {
          apiService.login({email, password}).then(result => {
            dispatch(login(result.access_token));
            dispatch(loginthunk(result.access_token));
          });
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
              {...register('email', {
                required: 'email is required',
                validate: value => {
                  return validateEmail(value)
                    ? undefined
                    : 'please enter valid email';
                },
              })}
              onSubmitEditing={() => setFocus('phoneNumber')}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              style={styles.textInput}
              textContentType="username"
              variant="outlined"
              label="email"
              onChangeText={value => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </Pressable>
      <Pressable onPress={() => setFocus('phoneNumber')}>
        {errors.phoneNumber && (
          <Text style={styles.error}>{errors.phoneNumber?.message}</Text>
        )}
        <Controller
          control={control}
          name="phoneNumber"
          render={({field}) => (
            <TextInput
              {...field}
              {...register('phoneNumber', {
                required: 'password is required',
                validate: value => {
                  return validatePhoneNumber(value)
                    ? undefined
                    : 'please enter valid phone number';
                },
              })}
              onSubmitEditing={() => setFocus('password')}
              autoCapitalize="none"
              autoComplete="tel"
              autoCorrect={false}
              keyboardType="number-pad"
              returnKeyType="next"
              style={styles.textInput}
              textContentType="telephoneNumber"
              variant="outlined"
              label="phoneNumber"
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
              onSubmitEditing={() => setFocus('cpassword')}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              secureTextEntry
              style={styles.textInput}
              textContentType="none"
              variant="outlined"
              label="password"
              onChangeText={value => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </Pressable>
      <Pressable onPress={() => setFocus('cpassword')}>
        {errors.cpassword && (
          <Text style={styles.error}>{errors.cpassword?.message}</Text>
        )}
        <Controller
          control={control}
          name="cpassword"
          render={({field}) => (
            <TextInput
              {...field}
              {...register('cpassword', {
                required: 'confirm password is required',
                validate: value => {
                  return control._fields.password?._f.value === value
                    ? undefined
                    : 'password does not match';
                },
              })}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              onSubmitEditing={onSubmit}
              returnKeyType="done"
              secureTextEntry
              style={styles.textInput}
              textContentType="password"
              variant="outlined"
              label="confirm password"
              onChangeText={value => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </Pressable>
      <TouchableOpacity onPress={onSubmit}>
        <View style={buttonStyles.button}>
          <Text style={buttonStyles.buttonTitle}>sign up</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default Signup;
