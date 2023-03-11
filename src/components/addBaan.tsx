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
import {BaanBase} from '../types/Baan';
import useStyles from '../styles/baan';
import {Baan} from '../types/BaanList';
import AppContext from '../services/storage';

interface DialogOptions {
  visible: boolean;
  setVisible: (visiblity: boolean) => any;
  invalidateData: (reason: number) => any;
  bhaaiId: string;
  type?: 'EDIT' | 'ADD';
  data?: Baan;
}

const AddBaan: React.FC<DialogOptions> = (props: DialogOptions) => {
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const {control, handleSubmit, setFocus, register} = useForm<BaanBase>({
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
        .then(data => {
          if (data) {
            props.invalidateData(Date.now());
            myContext.setAppSettings({
              ...myContext.appSettings,
              message: 'Baan has been updated',
            });
            setProcessingEdit(false);
            props.setVisible(false);
          }
        });
    } else {
      apiService.createBaan(props.bhaaiId, input).then(data => {
        if (data) {
          props.invalidateData(Date.now());
          myContext.setAppSettings({
            ...myContext.appSettings,
            message: 'Baan has been added',
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

  useEffect(() => {
    setFocus('firstName');
  }, [setFocus]);

  const deleteBaan = () => {
    setProcessingDelete(true);
    apiService.deleteBaan(props.data?._id as string, props.bhaaiId).then(() => {
      props.invalidateData(Date.now());
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Baan has been deleted',
      });
      setProcessingDelete(false);
      props.setVisible(false);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
        <DialogHeader title={`${props.type === 'ADD' ? 'add' : 'edit'} baan`} />
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
            <Controller
              control={control}
              name="amount"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('amount')}
                  onSubmitEditing={onSubmit}
                  autoCorrect={false}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  variant="outlined"
                  label="amount"
                  style={styles.textInput}
                  onChangeText={value => field.onChange(value)}
                  value={field.value + ''}
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
              onPress={deleteBaan}
              loading={processingDelete}
              disabled={processingDelete}
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
export default AddBaan;
