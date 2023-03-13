import {Button, TextInput, Text} from '@react-native-material/core';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import {apiService} from '../services/api.service';
import useStyles from '../styles/bhaai';
import {Baan as BaanType} from '../types/BaanList';
import ScreenHeading from './ui/screenHeading';
import SizedBox from './ui/sizedBox';

interface ComponentProps {
  setVisible: (visiblity: boolean) => any;
  showMessage: (reason: string) => any;
  data: BaanType;
}

const GiveBaan: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [processing, setProcessing] = useState(false);
  const styles = useStyles();
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<{amount: string}>({
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
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenHeading title={'give baan'} />
        <Pressable onPress={() => setFocus('amount')}>
          {errors.amount && (
            <Text style={styles.error}>{errors.amount?.message}</Text>
          )}
          <Controller
            control={control}
            name="amount"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('amount', {
                  required: 'amount is required',
                  min: {
                    value: 1,
                    message: 'amount should be more than 0',
                  },
                  validate: value => {
                    return value && value.match(/^[0-9]+$/)
                      ? undefined
                      : 'enter valid amount';
                  },
                })}
                onSubmitEditing={onSubmit}
                autoCorrect={false}
                autoFocus={true}
                keyboardType="number-pad"
                returnKeyType="done"
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
    </ScrollView>
  );
};

export default GiveBaan;
