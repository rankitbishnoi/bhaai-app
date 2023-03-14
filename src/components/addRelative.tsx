import {Button, TextInput, Text} from '@react-native-material/core';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import {apiService} from '../services/api.service';
import {Relative, RelativeBase} from '../types/Relative';
import useStyles from '../styles/relative';
import AppContext from '../services/storage';
import SizedBox from './ui/sizedBox';
import {validatePhoneNumber} from '../services/helpers';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';
import ScreenHeading from './ui/screenHeading';

interface ComponentProps {
  pariwarId: string;
  setVisible: (visiblity: string) => any;
  type?: 'EDIT' | 'ADD';
  data?: Relative;
}

const AddRelative: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<RelativeBase>({
    defaultValues: props.data || {
      firstName: '',
      lastName: '',
      nickName: '',
      fathersName: '',
      address: '',
      phoneNumber: '+91',
    },
  });

  const onSubmit = handleSubmit((input: RelativeBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService
        .updateRelative(props.data?._id as string, props.pariwarId, input)
        .then(data => {
          if (data) {
            myContext.dispatch({type: APP_ACTIONS.REFETCH_RELATIVE_LIST});
            myContext.dispatch({
              type: APP_ACTIONS.NEW_MESSAGE,
              payload: 'Relative has been updated',
            });
            setProcessingEdit(false);
            props.setVisible('');
          }
        });
    } else {
      apiService
        .createRelative(props.pariwarId, input)
        .catch(error => {
          if (error.type === 'NOT_AUTHENTICATED') {
            myContext.dispatch({type: APP_ACTIONS.LOGOUT});
          }

          return null;
        })
        .then(data => {
          if (data) {
            myContext.dispatch({type: APP_ACTIONS.REFETCH_RELATIVE_LIST});
            myContext.dispatch({
              type: APP_ACTIONS.NEW_MESSAGE,
              payload: 'Relative has been added',
            });
            setProcessingEdit(false);
            props.setVisible('');
          }
        });
    }
  });

  const close = () => {
    props.setVisible('');
  };

  const deleteRelative = () => {
    setProcessingDelete(true);
    apiService
      .deleteRelative(props.data?._id as string, props.pariwarId)
      .then(() => {
        myContext.dispatch({type: APP_ACTIONS.REFETCH_RELATIVE_LIST});
        myContext.dispatch({
          type: APP_ACTIONS.NEW_MESSAGE,
          payload: 'Relative has been deleted',
        });
        setProcessingDelete(false);
        props.setVisible('');
      });
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenHeading
          title={`${props.type === 'ADD' ? 'add' : 'edit'} relative`}
        />
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
                {...register('firstName', {required: 'first name is required'})}
                onSubmitEditing={() => setFocus('lastName')}
                autoCorrect={false}
                autoFocus={true}
                keyboardType="default"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="name"
                variant="outlined"
                label="firstName"
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
                {...register('lastName', {required: 'last name is required'})}
                onSubmitEditing={() => setFocus('nickName')}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="name"
                variant="outlined"
                label="lastName"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
        <Pressable onPress={() => setFocus('nickName')}>
          <Controller
            control={control}
            name="nickName"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('nickName', {required: 'nick name is required'})}
                onSubmitEditing={() => setFocus('fathersName')}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="name"
                variant="outlined"
                label="nickName"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
        <Pressable onPress={() => setFocus('fathersName')}>
          {errors.fathersName && (
            <Text style={styles.error}>{errors.fathersName?.message}</Text>
          )}
          <Controller
            control={control}
            name="fathersName"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('fathersName', {
                  required: "father's name is required",
                })}
                onSubmitEditing={() => setFocus('address')}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="name"
                variant="outlined"
                label="fathersName"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
        <Pressable onPress={() => setFocus('address')}>
          {errors.address && (
            <Text style={styles.error}>{errors.address?.message}</Text>
          )}
          <Controller
            control={control}
            name="address"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('address', {required: 'address is required'})}
                onSubmitEditing={() => setFocus('phoneNumber')}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="name"
                variant="outlined"
                label="address"
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
                  minLength: {value: 13, message: 'enter valid phone number'},
                  maxLength: {value: 13, message: 'enter valid phone number'},
                  validate: value => {
                    return validatePhoneNumber(value)
                      ? undefined
                      : 'please enter valid phone number';
                  },
                })}
                onSubmitEditing={onSubmit}
                autoCapitalize="none"
                autoComplete="tel"
                autoCorrect={false}
                keyboardType="number-pad"
                returnKeyType="done"
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
        <Button
          title="save"
          onPress={onSubmit}
          loading={processingEdit}
          disabled={processingEdit}
        />
        <SizedBox height={16} />
        {props.type === 'EDIT' && (
          <>
            <Button
              color="error"
              title="delete"
              loading={processingDelete}
              disabled={processingDelete}
              onPress={deleteRelative}
            />
            <SizedBox height={16} />
          </>
        )}
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
      <SizedBox height={60} />
    </ScrollView>
  );
};

export default AddRelative;
