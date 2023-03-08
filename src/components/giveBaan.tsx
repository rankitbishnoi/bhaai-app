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
import SizedBox from './SizedBox';
import useStyles from '../styles/bhaai';
import {Baan as BaanType} from '../types/BaanList';

interface DialogOptions {
  visible: boolean;
  setVisible: (visiblity: boolean) => any;
  showMessage: (reason: string) => any;
  data: BaanType;
}

const GiveBaan: React.FC<DialogOptions> = (props: DialogOptions) => {
  const [processing, setProcessing] = useState(false);
  const styles = useStyles();
  const {control, handleSubmit} = useForm<{amount: string}>({
    defaultValues: {
      amount: '0',
    },
  });

  const onSubmit = handleSubmit(({amount}) => {
    setProcessing(true);
    apiService
      .giveBaan(props.data?._id as string, parseInt(amount))
      .then(data => {
        if (data) {
          setProcessing(false);
          props.showMessage('GIVEN');
          props.setVisible(false);
        }
      });
  });

  const close = () => {
    props.setVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
        <DialogHeader title={'Give Baan'} />
        <DialogContent>
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
                    value={field.value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />
        </DialogContent>
        <DialogActions>
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
            loading={processing}
            disabled={processing}
          />
        </DialogActions>
      </Dialog>
    </KeyboardAvoidingView>
  );
};

export default GiveBaan;
