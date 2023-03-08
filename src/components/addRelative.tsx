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
import {Relative, RelativeBase} from '../types/Relative';
import SizedBox from './SizedBox';
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
  const {control, handleSubmit} = useForm<RelativeBase>({
    defaultValues: props.data || {
      firstName: '',
      lastName: '',
      nickName: '',
      fathersName: '',
      address: '',
      phoneNumber: '',
    },
  });

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
              <Text style={styles.label}>phone number</Text>
              <Controller
                control={control}
                name="phoneNumber"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCapitalize="none"
                    autoComplete="tel"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="telephoneNumber"
                    onChangeText={value => field.onChange(value)}
                    value={field.value}
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
