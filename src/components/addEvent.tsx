import {Button, TextInput, Text} from '@react-native-material/core';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import {EventInterface} from '../types/event';
import useStyles from '../styles/event';
import SizedBox from './ui/sizedBox';
import ScreenHeading from './ui/screenHeading';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  createdEvent,
  updatedEvent,
  deletedEvent,
} from '../redux/features/slices/event-slice';
import uuid from 'react-native-uuid';
import {createdMessages} from '../redux/features/slices/message-slice';

interface ComponentProps {
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: EventInterface;
}

const AddEvent: React.FC<ComponentProps> = (props: ComponentProps) => {
  const theme = useAppSelector(state => state.theme.mode);
  const userEmail = useAppSelector(state => state.profile.user.email);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const dispatch = useAppDispatch();
  const styles = useStyles(theme);
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<EventInterface>({
    defaultValues: props.data || {
      name: '',
    },
  });

  const onSubmit = handleSubmit((input: EventInterface) => {
    setProcessingEdit(true);
    if (props.data && props.type === 'EDIT') {
      dispatch(
        updatedEvent({
          ...input,
          _id: props.data?._id,
        }),
      );
      dispatch(createdMessages('Event has been updated'));
    } else {
      const newEvent = {
        ...input,
        createdBy: {
          email: userEmail,
        },
        tasks: [],
        _id: uuid.v4().toString(),
      };
      dispatch(createdEvent(newEvent));
      dispatch(createdMessages('Event has been added'));
    }
    setProcessingEdit(false);
    props.setVisible(false);
  });

  const close = () => {
    props.setVisible(false);
  };

  const deleteEvent = () => {
    if (props.data) {
      setProcessingDelete(true);
      dispatch(deletedEvent(props.data?._id));
      dispatch(createdMessages('Event has been deleted'));
      setProcessingDelete(false);
      props.setVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenHeading
          title={`${props.type === 'ADD' ? 'add' : 'edit'} event`}
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
              onPress={deleteEvent}
            />
            <SizedBox height={16} />
          </>
        )}
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
      <SizedBox height={60} />
    </ScrollView>
  );
};

export default AddEvent;
