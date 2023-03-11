import {Button, TextInput, Stack, Text} from '@react-native-material/core';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import {apiService} from '../services/api.service';
import useStyles from '../styles/bhaai';
import {Baan as BaanType} from '../types/BaanList';
import SizedBox from './SizedBox';

interface ComponentProps {
  setVisible: (visiblity: boolean) => any;
  showMessage: (reason: string) => any;
  data: BaanType;
}

const GiveBaan: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [processing, setProcessing] = useState(false);
  const styles = useStyles();
  const {control, handleSubmit, setFocus, register} = useForm<{amount: string}>(
    {
      defaultValues: {
        amount: '0',
      },
    },
  );

  useEffect(() => {
    setFocus('amount');
  }, [setFocus]);

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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Stack m={4} spacing={4}>
          <Text style={styles.heading} variant="button">
            {'give baan'}
          </Text>
        </Stack>
        <Pressable onPress={() => setFocus('amount')}>
          <Controller
            control={control}
            name="amount"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('amount')}
                autoCorrect={false}
                keyboardType="number-pad"
                returnKeyType="next"
                variant="outlined"
                label="amount"
                style={styles.textInput}
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
        <Button
          title="save"
          onPress={onSubmit}
          loading={processing}
          disabled={processing}
        />
        <SizedBox height={16} />
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default GiveBaan;
