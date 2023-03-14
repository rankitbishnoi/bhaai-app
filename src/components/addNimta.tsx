import {Button, TextInput, Text} from '@react-native-material/core';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import {apiService} from '../services/api.service';
import {Nimta, NimtaBase} from '../types/Nimta';
import useStyles from '../styles/nimta';
import AppContext from '../services/storage';
import SizedBox from './ui/sizedBox';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';
import ScreenHeading from './ui/screenHeading';

interface ComponentProps {
  pariwarId: string;
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: Nimta;
}

const AddNimta: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const myContext = useContext<AppContextState>(AppContext);
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

  const onSubmit = handleSubmit((input: NimtaBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService
        .updateNimta(props.data?._id as string, props.pariwarId, input)
        .then(data => {
          if (data) {
            myContext.dispatch({type: APP_ACTIONS.REFETCH_NIMTA_LIST});
            myContext.dispatch({
              type: APP_ACTIONS.NEW_MESSAGE,
              payload: 'Nimta has been updated',
            });
            setProcessingEdit(false);
            props.setVisible(false);
          }
        });
    } else {
      apiService
        .createNimta(props.pariwarId, input)
        .catch(error => {
          if (error.type === 'NOT_AUTHENTICATED') {
            myContext.dispatch({type: APP_ACTIONS.LOGOUT});
          }

          return null;
        })
        .then(data => {
          if (data) {
            myContext.dispatch({type: APP_ACTIONS.REFETCH_NIMTA_LIST});
            myContext.dispatch({
              type: APP_ACTIONS.NEW_MESSAGE,
              payload: 'Nimta has been added',
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
        myContext.dispatch({type: APP_ACTIONS.REFETCH_NIMTA_LIST});
        myContext.dispatch({
          type: APP_ACTIONS.NEW_MESSAGE,
          payload: 'Nimta has been deleted',
        });
        setProcessingDelete(false);
        props.setVisible(false);
      });
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
