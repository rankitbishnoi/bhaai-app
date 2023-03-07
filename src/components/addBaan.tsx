import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
} from '@react-native-material/core';
import React, {useState} from 'react';
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

interface DialogOptions {
  visible: boolean;
  setVisible: (visiblity: boolean) => any;
  reloadList?: (reason: string) => any;
  bhaaiId: string;
  type?: 'EDIT' | 'ADD';
  data?: Baan;
}

const AddBaan: React.FC<DialogOptions> = (props: DialogOptions) => {
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
            props.reloadList && props.reloadList('EDIT');
            setProcessingEdit(false);
            props.setVisible(false);
          }
        });
    } else {
      apiService.createBaan(props.bhaaiId, input).then(data => {
        if (data) {
          props.reloadList && props.reloadList('ADD');
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
      props.reloadList && props.reloadList('DELETE');
      setProcessingDelete(false);
      props.setVisible(false);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
        <DialogHeader title={`${props.type === 'ADD' ? 'Add' : 'Edit'} Baan`} />
        <DialogContent>
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>First Name</Text>
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
              <Text style={styles.label}>Last Name</Text>
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
              <Text style={styles.label}>Nick Name</Text>
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
              <Text style={styles.label}>Father's Name</Text>
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
              <Text style={styles.label}>Address</Text>
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
              <Text style={styles.label}>Amount</Text>
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
              title="Delete"
              compact
              variant="text"
              onPress={deleteBaan}
              loading={processingDelete}
              disabled={processingDelete}
            />
          )}
          <Button
            color="secondary"
            title="Cancel"
            compact
            variant="text"
            onPress={close}
          />
          <Button
            title="Save"
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
