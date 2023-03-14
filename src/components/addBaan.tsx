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
import {BaanBase} from '../types/Baan';
import useStyles from '../styles/baan';
import {Baan} from '../types/BaanList';
import AppContext from '../services/storage';
import SizedBox from './ui/sizedBox';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';
import ScreenHeading from './ui/screenHeading';

interface ComponentProps {
  setVisible: (visiblity: boolean) => any;
  bhaaiId: string;
  type?: 'EDIT' | 'ADD';
  data?: Baan;
}

const AddBaan: React.FC<ComponentProps> = (props: ComponentProps) => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<BaanBase>({
    defaultValues: props.data || {
      firstName: '',
      lastName: '',
      nickName: '',
      fathersName: '',
      address: '',
      amount: 0,
    },
  });

  const onSubmit = handleSubmit((input: BaanBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService
        .updateBaan(props.data?._id as string, props.bhaaiId, input)
        .catch(error => {
          if (error.type === 'NOT_AUTHENTICATED') {
            myContext.dispatch({type: APP_ACTIONS.LOGOUT});
          }

          return null;
        })
        .then(data => {
          if (data) {
            myContext.dispatch({type: APP_ACTIONS.REFETCH_BAAN_LIST});
            myContext.dispatch({
              type: APP_ACTIONS.NEW_MESSAGE,
              payload: 'Baan has been updated',
            });
            setProcessingEdit(false);
            props.setVisible(false);
          }
        });
    } else {
      apiService
        .createBaan(props.bhaaiId, input)
        .catch(error => {
          if (error.type === 'NOT_AUTHENTICATED') {
            myContext.dispatch({type: APP_ACTIONS.LOGOUT});
          }

          return null;
        })
        .then(data => {
          if (data) {
            myContext.dispatch({type: APP_ACTIONS.REFETCH_BAAN_LIST});
            myContext.dispatch({
              type: APP_ACTIONS.NEW_MESSAGE,
              payload: 'Baan has been added',
            });
            setProcessingEdit(false);
            props.setVisible(false);
          }
        });
    }
  });

  const close = () => {
    props.setVisible(false);
  };

  const deleteBaan = () => {
    setProcessingDelete(true);
    apiService
      .deleteBaan(props.data?._id as string, props.bhaaiId)
      .catch(error => {
        if (error.type === 'NOT_AUTHENTICATED') {
          myContext.dispatch({type: APP_ACTIONS.LOGOUT});
        }

        return null;
      })
      .then(() => {
        myContext.dispatch({type: APP_ACTIONS.REFETCH_BAAN_LIST});
        myContext.dispatch({
          type: APP_ACTIONS.NEW_MESSAGE,
          payload: 'Baan has been deleted',
        });
        setProcessingDelete(false);
        props.setVisible(false);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenHeading
          title={`${props.type === 'ADD' ? 'add' : 'edit'} baan`}
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
                {...register('nickName')}
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
                onSubmitEditing={() => setFocus('amount')}
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

        <Pressable onPress={() => setFocus('amount')}>
          {errors.amount && (
            <Text style={styles.error}>{errors.amount?.message}</Text>
          )}
          <Controller
            control={control}
            name="amount"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('amount', {
                  required: 'amount is required',
                  min: {
                    value: 1,
                    message: 'amount should be more than 0',
                  },
                  validate: value => {
                    return value && value.toString().match(/^[0-9]+$/)
                      ? undefined
                      : 'enter valid amount';
                  },
                })}
                onSubmitEditing={onSubmit}
                autoCorrect={false}
                keyboardType="number-pad"
                returnKeyType="done"
                variant="outlined"
                label="amount"
                style={styles.textInput}
                onChangeText={value => field.onChange(value)}
                value={field.value + ''}
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
              onPress={deleteBaan}
              loading={processingDelete}
              disabled={processingDelete}
            />
            <SizedBox height={16} />
          </>
        )}
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
export default AddBaan;
