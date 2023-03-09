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
import {BhaaiBase} from '../types/Bhaai';
import SizedBox from './SizedBox';
import useStyles from '../styles/bhaai';
import DatePicker from 'react-native-date-picker';
import {Bhaai} from '../types/BhaaiList';
import AppContext from '../services/storage';

interface DialogOptions {
  visible: boolean;
  setVisible: (visiblity: boolean) => any;
  invalidateData: (reason: number) => any;
  type?: 'EDIT' | 'ADD';
  data?: Bhaai;
}

const AddBhaai: React.FC<DialogOptions> = (props: DialogOptions) => {
  const myContext = useContext(AppContext);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const styles = useStyles();
  const {control, handleSubmit} = useForm<BhaaiBase>({
    defaultValues: props.data || {
      marriage: '',
      date: '',
    },
  });

  const onSubmit = handleSubmit((input: BhaaiBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService.updateBhaai(props.data?._id as string, input).then(data => {
        if (data) {
          props.invalidateData(Date.now());
          myContext.setAppSettings({
            ...myContext.appSettings,
            message: 'Bhaai has been updated',
          });
          setProcessingEdit(false);
          props.setVisible(false);
        }
      });
    } else {
      apiService.createBhaai(input).then(data => {
        if (data) {
          props.invalidateData(Date.now());
          myContext.setAppSettings({
            ...myContext.appSettings,
            message: 'Bhaai has been added',
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

  const deleteBhaai = () => {
    setProcessingDelete(true);
    apiService.deleteBhaai(props.data?._id as string).then(() => {
      props.invalidateData(Date.now());
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Bhaai has been deleted',
      });
      setProcessingDelete(false);
      props.setVisible(false);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
        <DialogHeader
          title={`${props.type === 'ADD' ? 'add' : 'edit'} bhaai`}
        />
        <DialogContent>
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>marriage</Text>
              <Controller
                control={control}
                name="marriage"
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
              <Text style={styles.label}>date</Text>
              <Controller
                control={control}
                name="date"
                render={({field}) => (
                  <>
                    <TextInput
                      {...field}
                      autoCorrect={false}
                      returnKeyType="next"
                      style={styles.textInput}
                      textContentType="none"
                      onChangeText={value => field.onChange(value)}
                      value={field.value}
                      onFocus={() => {
                        setOpenDatePicker(true);
                      }}
                    />
                    <DatePicker
                      modal
                      mode={'date'}
                      open={openDatePicker}
                      date={new Date(control._formValues.date || Date.now())}
                      onConfirm={selectedDate => {
                        setOpenDatePicker(false);
                        field.onChange(selectedDate.toDateString());
                      }}
                      onCancel={() => {
                        setOpenDatePicker(false);
                      }}
                    />
                  </>
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
              onPress={deleteBhaai}
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

export default AddBhaai;
