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
import {Nimta, NimtaBase} from '../types/Nimta';
import SizedBox from './SizedBox';
import useStyles from '../styles/nimta';
import AppContext from '../services/storage';

interface DialogOptions {
  visible: boolean;
  pariwarId: string;
  invalidateData: (key: number) => any;
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: Nimta;
}

const AddNimta: React.FC<DialogOptions> = (props: DialogOptions) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const {control, handleSubmit} = useForm<NimtaBase>({
    defaultValues: props.data || {
      name: '',
    },
  });

  const onSubmit = handleSubmit((input: NimtaBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService
        .updateNimta(props.data?._id as string, props.pariwarId, input)
        .then(data => {
          if (data) {
            props.invalidateData(Date.now());
            myContext.setAppSettings({
              ...myContext.appSettings,
              message: 'Nimta has been updated',
            });
            setProcessingEdit(false);
            props.setVisible(false);
          }
        });
    } else {
      apiService.createNimta(props.pariwarId, input).then(data => {
        if (data) {
          myContext.setAppSettings({
            ...myContext.appSettings,
            message: 'Nimta has been added',
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

  const deleteNimta = () => {
    setProcessingDelete(true);
    apiService
      .deleteNimta(props.data?._id as string, props.pariwarId)
      .then(() => {
        myContext.setAppSettings({
          ...myContext.appSettings,
          message: 'Nimta has been deleted',
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
          title={`${props.type === 'ADD' ? 'add' : 'edit'} nimta`}
        />
        <DialogContent>
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>name</Text>
              <Controller
                control={control}
                name="name"
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
              onPress={deleteNimta}
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

export default AddNimta;
