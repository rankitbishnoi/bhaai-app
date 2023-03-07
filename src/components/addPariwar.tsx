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
import {PariwarBase} from '../types/Pariwar';
import SizedBox from './SizedBox';
import useStyles from '../styles/bhaai';
import {Pariwar} from '../types/PariwarList';
import {useQueryClient} from 'react-query';

interface DialogOptions {
  visible: boolean;
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: Pariwar;
}

const AddPariwar: React.FC<DialogOptions> = (props: DialogOptions) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const styles = useStyles();
  const queryClient = useQueryClient();
  const {control, handleSubmit} = useForm<PariwarBase>({
    defaultValues: props.data || {
      name: '',
    },
  });

  const onSubmit = handleSubmit((input: PariwarBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService.updatePariwar(props.data?._id as string, input).then(data => {
        if (data) {
          queryClient.invalidateQueries('profile');
          setProcessingEdit(false);
          props.setVisible(false);
        }
      });
    } else {
      apiService.createPariwar(input).then(data => {
        if (data) {
          queryClient.invalidateQueries('profile');
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
      queryClient.invalidateQueries('profile');
      setProcessingDelete(false);
      props.setVisible(false);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
        <DialogHeader
          title={`${props.type === 'ADD' ? 'Add' : 'Edit'} Pariwar`}
        />
        <DialogContent>
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>Name</Text>
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
              title="Delete"
              compact
              variant="text"
              loading={processingDelete}
              disabled={processingDelete}
              onPress={deletePariwar}
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

export default AddPariwar;
