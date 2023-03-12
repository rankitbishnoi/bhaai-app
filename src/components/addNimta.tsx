import {Button, TextInput, Stack, Text} from '@react-native-material/core';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import {apiService} from '../services/api.service';
import {Nimta, NimtaBase} from '../types/Nimta';
import useStyles from '../styles/nimta';
import AppContext from '../services/storage';
import SizedBox from './SizedBox';

interface ComponentProps {
  pariwarId: string;
  invalidateData: (key: number) => any;
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: Nimta;
}

const AddNimta: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<NimtaBase>({
    defaultValues: props.data || {
      name: '',
    },
  });

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

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
          props.invalidateData(Date.now());
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
        props.invalidateData(Date.now());
        myContext.setAppSettings({
          ...myContext.appSettings,
          message: 'Nimta has been deleted',
        });
        setProcessingDelete(false);
        props.setVisible(false);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Stack m={4} spacing={4}>
          <Text style={styles.heading} variant="button">
            {`${props.type === 'ADD' ? 'add' : 'edit'} nimta`}
          </Text>
        </Stack>
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
              onPress={deleteNimta}
            />
            <SizedBox height={16} />
          </>
        )}
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddNimta;
