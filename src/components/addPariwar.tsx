import {Button, TextInput, Text} from '@react-native-material/core';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import {apiService} from '../services/api.service';
import {PariwarBase} from '../types/Pariwar';
import useStyles from '../styles/bhaai';
import {Pariwar} from '../types/PariwarList';
import SizedBox from './sizedBox';
import ScreenHeading from './screenHeading';

interface ComponentProps {
  invalidateData: (key: number) => any;
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: Pariwar;
}

const AddPariwar: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const styles = useStyles();
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<PariwarBase>({
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenHeading
          title={`${props.type === 'ADD' ? 'add' : 'edit'} pariwar`}
        />
        <Pressable onPress={() => setFocus('name')}>
          {errors.name && (
            <Text style={styles.error}>{errors.name?.message}</Text>
          )}
          <Controller
            control={control}
            name="name"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('name', {required: 'name is required'})}
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
        <Button
          title="save"
          onPress={onSubmit}
          loading={processingEdit}
          disabled={processingEdit}
        />
        <SizedBox height={16} />
        {props.type === 'EDIT' && (
          <>
            <Button
              color="error"
              title="delete"
              loading={processingDelete}
              disabled={processingDelete}
              onPress={deletePariwar}
            />
            <SizedBox height={16} />
          </>
        )}
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddPariwar;
