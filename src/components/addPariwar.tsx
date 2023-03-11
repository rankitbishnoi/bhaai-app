import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
  TextInput,
} from '@react-native-material/core';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, Platform, Pressable} from 'react-native';
import {apiService} from '../services/api.service';
import {PariwarBase} from '../types/Pariwar';
import useStyles from '../styles/bhaai';
import {Pariwar} from '../types/PariwarList';

interface DialogOptions {
  visible: boolean;
  invalidateData: (key: number) => any;
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: Pariwar;
}

const AddPariwar: React.FC<DialogOptions> = (props: DialogOptions) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const styles = useStyles();
  const {control, handleSubmit, setFocus, register} = useForm<PariwarBase>({
    defaultValues: props.data || {
      name: '',
    },
  });
  useEffect(() => {
    setFocus('name');
  }, [setFocus]);
  const onSubmit = handleSubmit((input: PariwarBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService.updatePariwar(props.data?._id as string, input).then(data => {
        if (data) {
          props.invalidateData(Date.now());
          setProcessingEdit(false);
          props.setVisible(false);
        }
      });
    } else {
      apiService.createPariwar(input).then(data => {
        if (data) {
          props.invalidateData(Date.now());
          setProcessingEdit(false);
          props.setVisible(false);
        }
      });
    }
  });

  const close = () => {
    props.setVisible(false);
  };

  const deletePariwar = () => {
    setProcessingDelete(true);
    apiService.deletePariwar(props.data?._id as string).then(() => {
      props.invalidateData(Date.now());
      setProcessingDelete(false);
      props.setVisible(false);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
        <DialogHeader
          title={`${props.type === 'ADD' ? 'add' : 'edit'} pariwar`}
        />
        <DialogContent>
          <Pressable onPress={() => setFocus('name')}>
            <Controller
              control={control}
              name="name"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('name')}
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  style={styles.textInput}
                  textContentType="name"
                  variant="outlined"
                  label="name"
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
              onPress={deletePariwar}
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

export default AddPariwar;
