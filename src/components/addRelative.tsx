import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
  TextInput,
} from '@react-native-material/core';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, Platform, Pressable} from 'react-native';
import {apiService} from '../services/api.service';
import {Relative, RelativeBase} from '../types/Relative';
import useStyles from '../styles/relative';
import AppContext from '../services/storage';

interface DialogOptions {
  visible: string;
  pariwarId: string;
  invalidateData: (key: number) => any;
  setVisible: (visiblity: string) => any;
  type?: 'EDIT' | 'ADD';
  data?: Relative;
}

const AddRelative: React.FC<DialogOptions> = (props: DialogOptions) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const {control, handleSubmit, setFocus, register} = useForm<RelativeBase>({
    defaultValues: props.data || {
      firstName: '',
      lastName: '',
      nickName: '',
      fathersName: '',
      address: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    setFocus('firstName');
  }, [setFocus]);

  const onSubmit = handleSubmit((input: RelativeBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService
        .updateRelative(props.data?._id as string, props.pariwarId, input)
        .then(data => {
          if (data) {
            props.invalidateData(Date.now());
            myContext.setAppSettings({
              ...myContext.appSettings,
              message: 'Relative has been updated',
            });
            setProcessingEdit(false);
            props.setVisible('');
          }
        });
    } else {
      apiService.createRelative(props.pariwarId, input).then(data => {
        if (data) {
          props.invalidateData(Date.now());
          myContext.setAppSettings({
            ...myContext.appSettings,
            message: 'Relative has been added',
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
        props.invalidateData(Date.now());
        myContext.setAppSettings({
          ...myContext.appSettings,
          message: 'Relative has been deleted',
        });
        setProcessingDelete(false);
        props.setVisible('');
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog
        visible={props.visible === 'add' || props.visible === 'edit'}
        onDismiss={() => props.setVisible('')}>
        <DialogHeader
          title={`${props.type === 'ADD' ? 'add' : 'edit'} relative`}
        />
        <DialogContent>
          <Pressable onPress={() => setFocus('firstName')}>
            <Controller
              control={control}
              name="firstName"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('firstName')}
                  onSubmitEditing={() => setFocus('lastName')}
                  autoCorrect={false}
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
            <Controller
              control={control}
              name="lastName"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('lastName')}
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
            <Controller
              control={control}
              name="fathersName"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('fathersName')}
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
            <Controller
              control={control}
              name="address"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('address')}
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
            <Controller
              control={control}
              name="phoneNumber"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('phoneNumber')}
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
        </DialogContent>
        <DialogActions>
          {props.type === 'EDIT' && (
            <Button
              color="error"
              title="delete"
              compact
              variant="text"
              loading={processingDelete}
              disabled={processingDelete}
              onPress={deleteRelative}
            />
          )}
          <Button
            color="secondary"
            title="cancel"
            compact
            variant="text"
            onPress={close}
          />
          <Button
            title="save"
            compact
            variant="text"
            onPress={onSubmit}
            loading={processingEdit}
            disabled={processingEdit}
          />
        </DialogActions>
      </Dialog>
    </KeyboardAvoidingView>
  );
};

export default AddRelative;
