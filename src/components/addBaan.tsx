import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
} from '@react-native-material/core';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
  TextInput,
} from 'react-native';
import {apiService} from '../services/api.service';
import {BaanBase} from '../types/Baan';
import SizedBox from './SizedBox';
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
  const {control, handleSubmit} = useForm<BaanBase>({
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
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>first name</Text>
              <Controller
                control={control}
                name="firstName"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
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
              <Text style={styles.label}>last name</Text>
              <Controller
                control={control}
                name="lastName"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
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
              <Text style={styles.label}>nick name</Text>
              <Controller
                control={control}
                name="nickName"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
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
              <Text style={styles.label}>father's name</Text>
              <Controller
                control={control}
                name="fathersName"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
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
              <Text style={styles.label}>address</Text>
              <Controller
                control={control}
                name="address"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
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
              <Text style={styles.label}>amount</Text>
              <Controller
                control={control}
                name="amount"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    style={styles.textInput}
                    onChangeText={value => field.onChange(value)}
                    value={field.value + ''}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />
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
