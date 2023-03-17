import {Button, TextInput, Text} from '@react-native-material/core';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import {Nimta, NimtaBase} from '../types/Nimta';
import useStyles from '../styles/nimta';
import SizedBox from './ui/sizedBox';
import ScreenHeading from './ui/screenHeading';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {createdMessages} from '../redux/features/slices/message-slice';
import {
  createdNimta,
  deletedNimta,
  nimtaListApi,
  updatedNimta,
} from '../redux/features/slices/nimta-slice';
import uuid from 'react-native-uuid';

interface ComponentProps {
  pariwarId: string;
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: Nimta;
}

const AddNimta: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const theme = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
  const styles = useStyles(theme);
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

  const onSubmit = handleSubmit((input: NimtaBase) => {
    setProcessingEdit(true);
    const newBaanPayload = {
      pariwarId: props.pariwarId,
      body: {
        ...input,
        pariwarId: props.pariwarId,
        _id: props.data?._id || uuid.v4().toString(),
      },
    };
    if (props.type === 'EDIT') {
      dispatch(updatedNimta(newBaanPayload));
      dispatch(nimtaListApi.endpoints.updatedNimta.initiate(newBaanPayload));
      dispatch(createdMessages('Nimta has been updated'));
    } else {
      dispatch(createdNimta(newBaanPayload));
      dispatch(nimtaListApi.endpoints.createNimta.initiate(newBaanPayload));
      dispatch(createdMessages('Nimta has been created'));
    }
    setProcessingEdit(false);
    setProcessingEdit(true);
    props.setVisible(false);
  });

  const close = () => {
    props.setVisible(false);
  };

  const deleteNimta = () => {
    if (props.data) {
      setProcessingDelete(true);
      const baanPayload = {
        pariwarId: props.pariwarId,
        id: props.data?._id,
      };
      dispatch(deletedNimta(baanPayload));
      dispatch(nimtaListApi.endpoints.deleteNimta.initiate(baanPayload));
      dispatch(createdMessages('Nimta has been deleted'));
      setProcessingEdit(false);
      props.setVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenHeading
          title={`${props.type === 'ADD' ? 'add' : 'edit'} nimta`}
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
                onSubmitEditing={onSubmit}
                autoCorrect={false}
                autoFocus={true}
                keyboardType="default"
                returnKeyType="done"
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
    </ScrollView>
  );
};

export default AddNimta;
