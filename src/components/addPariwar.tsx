import {Button, TextInput, Text} from '@react-native-material/core';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import {PariwarBase} from '../types/Pariwar';
import useStyles from '../styles/bhaai';
import {Pariwar} from '../types/PariwarList';
import SizedBox from './ui/sizedBox';
import ScreenHeading from './ui/screenHeading';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {profileApi} from '../redux/features/slices/profile-slice';
import {createdMessages} from '../redux/features/slices/message-slice';
import uuid from 'react-native-uuid';

interface ComponentProps {
  setVisible: (visiblity: boolean) => any;
  refetch: () => any;
  type?: 'EDIT' | 'ADD';
  data?: Pariwar;
}

const AddPariwar: React.FC<ComponentProps> = (props: ComponentProps) => {
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
  } = useForm<PariwarBase>({
    defaultValues: props.data || {
      name: '',
    },
  });

  const onSubmit = handleSubmit((input: PariwarBase) => {
    setProcessingEdit(true);
    const newBaanPayload = {
      ...input,
      _id: props.data?._id || uuid.v4().toString(),
    };
    if (props.type === 'EDIT') {
      dispatch(profileApi.endpoints.updatedPariwar.initiate(newBaanPayload));
      dispatch(createdMessages('Pariwar has been updated'));
    } else {
      dispatch(profileApi.endpoints.createPariwar.initiate(newBaanPayload));
      dispatch(createdMessages('Pariwar has been created'));
    }
    setProcessingEdit(false);
    props.setVisible(false);
  });

  const close = () => {
    props.setVisible(false);
  };

  const deletePariwar = () => {
    if (props.data) {
      setProcessingDelete(true);
      dispatch(profileApi.endpoints.deletePariwar.initiate(props.data?._id));
      dispatch(createdMessages('Pariwar has been deleted'));
      setProcessingDelete(false);
      props.setVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
              onPress={deletePariwar}
            />
            <SizedBox height={16} />
          </>
        )}
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddPariwar;
