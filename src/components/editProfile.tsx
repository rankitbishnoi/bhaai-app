import {Button, TextInput, Text} from '@react-native-material/core';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import useStyles from '../styles/bhaai';
import SizedBox from './ui/sizedBox';
import ScreenHeading from './ui/screenHeading';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {profileApi} from '../redux/features/slices/profile-slice';
import {createdMessages} from '../redux/features/slices/message-slice';
import {CustomerBase} from '../types/Profile';
import {validateEmail} from '../services/helpers';

interface ComponentProps {
  setVisible: (visiblity: boolean) => any;
  data: Partial<CustomerBase>;
}

const EditProfile: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const theme = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
  const styles = useStyles(theme);
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<Partial<CustomerBase>>({
    defaultValues: props.data,
  });

  const onSubmit = handleSubmit((input: Partial<CustomerBase>) => {
    setProcessingEdit(true);
    dispatch(profileApi.endpoints.updatedProfile.initiate(input));
    dispatch(createdMessages('Profile has been updated'));
    setProcessingEdit(false);
    props.setVisible(false);
  });

  const close = () => {
    props.setVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenHeading title={'edit profile'} />
        <Pressable onPress={() => setFocus('firstName')}>
          {errors.firstName && (
            <Text style={styles.error}>{errors.firstName?.message}</Text>
          )}
          <Controller
            control={control}
            name="firstName"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('firstName', {required: 'firstName is required'})}
                onSubmitEditing={() => setFocus('lastName')}
                autoCorrect={false}
                autoFocus={true}
                keyboardType="default"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="name"
                variant="outlined"
                label="first name"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
        <Pressable onPress={() => setFocus('lastName')}>
          {errors.lastName && (
            <Text style={styles.error}>{errors.lastName?.message}</Text>
          )}
          <Controller
            control={control}
            name="lastName"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('lastName', {required: 'lastName is required'})}
                onSubmitEditing={() => setFocus('email')}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="done"
                style={styles.textInput}
                textContentType="name"
                variant="outlined"
                label="last name"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
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
                returnKeyType="done"
                style={styles.textInput}
                textContentType="username"
                {...register('email', {
                  required: 'email is required',
                  validate: value => {
                    return value && validateEmail(value)
                      ? undefined
                      : 'please enter valid email';
                  },
                })}
                onSubmitEditing={onSubmit}
                variant="outlined"
                label="email"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
        <Button
          title="save"
          onPress={onSubmit}
          loading={processingEdit}
          disabled={processingEdit}
        />
        <SizedBox height={16} />
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default EditProfile;
