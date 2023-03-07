import React, {useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Pressable, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import AppContext from '../services/storage';
import mmkv from '../services/mmkv';
import useStyles from '../styles/auth';
import SizedBox from './SizedBox';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC<{}> = ({}) => {
  const myContext = useContext(AppContext);
  const {control, handleSubmit} = useForm<FormData>({
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
        myContext.setAppSettings({
          ...myContext.appSettings,
          error: JSON.stringify(error),
        });
        return {access_token: ''};
      })
      .then(result => {
        if (result.access_token.length) {
          mmkv.saveKey('id_token', result.access_token);
          myContext.setAppSettings({isLoggedIn: true});
        }
      });
  });

  const styles = useStyles();

  return (
    <>
      <Pressable>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
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
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </View>
      </Pressable>

      <SizedBox height={16} />

      <Pressable>
        <View style={styles.form}>
          <Text style={styles.label}>Password</Text>

          <Controller
            control={control}
            name="password"
            render={({field}) => (
              <TextInput
                {...field}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                onSubmitEditing={onSubmit}
                returnKeyType="done"
                secureTextEntry
                style={styles.textInput}
                textContentType="password"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </View>
      </Pressable>

      <SizedBox height={16} />

      <TouchableOpacity onPress={onSubmit}>
        <View style={styles.button}>
          <Text style={styles.buttonTitle}>Continue</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default Login;
