import React, {useContext, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import AppContext from '../services/storage';
import useStyles from '../styles/auth';
import mmkv from '../services/mmkv';

import useButtonStyles from '../styles/button';
import {TextInput} from '@react-native-material/core';

interface FormData {
  email: string;
  phoneNumber: string;
  password: string;
  cpassword: string;
}

const Signup: React.FC<{}> = ({}) => {
  const myContext = useContext(AppContext);
  const {control, handleSubmit, setFocus, register} = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      cpassword: '',
      phoneNumber: '+91',
    },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = handleSubmit(({email, password}) => {
    apiService
      .signup({
        email,
        password,
      })
      .catch(error => {
        myContext.setAppSettings({
          ...myContext.appSettings,
          message: error.response.data?.message || 'Unable to SignUp',
        });
        return {access_token: ''};
      })
      .then(data => {
        if (data) {
          apiService.login({email, password}).then(result => {
            mmkv.saveKey('id_token', result.access_token);
            myContext.setAppSettings({isLoggedIn: true});
          });
        }
      });
  });

  const styles = useStyles();
  const buttonStyles = useButtonStyles();

  return (
    <>
      <Pressable onPress={() => setFocus('email')}>
        <Controller
          control={control}
          name="email"
          render={({field}) => (
            <TextInput
              {...field}
              {...register('email')}
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
        <Controller
          control={control}
          name="phoneNumber"
          render={({field}) => (
            <TextInput
              {...field}
              {...register('phoneNumber')}
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
        <Controller
          control={control}
          name="password"
          render={({field}) => (
            <TextInput
              {...field}
              {...register('password')}
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
        <Controller
          control={control}
          name="cpassword"
          render={({field}) => (
            <TextInput
              {...field}
              {...register('cpassword')}
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
