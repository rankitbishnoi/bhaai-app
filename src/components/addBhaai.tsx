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
import {BhaaiBase} from '../types/Bhaai';
import useStyles from '../styles/bhaai';
import DatePicker from 'react-native-date-picker';
import {Bhaai} from '../types/BhaaiList';
import AppContext from '../services/storage';
import SizedBox from './ui/sizedBox';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';
import ScreenHeading from './ui/screenHeading';

interface ComponentProps {
  setVisible: (visiblity: boolean) => any;
  type?: 'EDIT' | 'ADD';
  data?: Bhaai;
}

const AddBhaai: React.FC<ComponentProps> = (props: ComponentProps) => {
  const myContext = useContext<AppContextState>(AppContext);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const styles = useStyles();
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: {errors},
  } = useForm<BhaaiBase>({
    defaultValues: props.data || {
      marriage: '',
      date: '',
    },
  });

  const onSubmit = handleSubmit((input: BhaaiBase) => {
    setProcessingEdit(true);
    if (props.type === 'EDIT') {
      apiService
        .updateBhaai(props.data?._id as string, input)
        .catch(error => {
          if (error.type === 'NOT_AUTHENTICATED') {
            myContext.dispatch({type: APP_ACTIONS.LOGOUT});
          }

          return null;
        })
        .then(data => {
          if (data) {
            myContext.dispatch({type: APP_ACTIONS.REFETCH_BHAAI_LIST});
            myContext.dispatch({
              type: APP_ACTIONS.NEW_MESSAGE,
              payload: 'Bhaai has been updated',
            });
            setProcessingEdit(false);
            props.setVisible(false);
          }
        });
    } else {
      apiService
        .createBhaai(input)
        .catch(error => {
          if (error.type === 'NOT_AUTHENTICATED') {
            myContext.dispatch({type: APP_ACTIONS.LOGOUT});
          }

          return null;
        })
        .then(data => {
          if (data) {
            myContext.dispatch({type: APP_ACTIONS.REFETCH_BHAAI_LIST});
            myContext.dispatch({
              type: APP_ACTIONS.NEW_MESSAGE,
              payload: 'Bhaai has been added',
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

  const deleteBhaai = () => {
    setProcessingDelete(true);
    apiService
      .deleteBhaai(props.data?._id as string)
      .catch(error => {
        if (error.type === 'NOT_AUTHENTICATED') {
          myContext.dispatch({type: APP_ACTIONS.LOGOUT});
        }

        return null;
      })
      .then(() => {
        myContext.dispatch({type: APP_ACTIONS.REFETCH_BHAAI_LIST});
        myContext.dispatch({
          type: APP_ACTIONS.NEW_MESSAGE,
          payload: 'Bhaai has been deleted',
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
          title={`${props.type === 'ADD' ? 'add' : 'edit'} bhaai`}
        />
        <Pressable onPress={() => setFocus('marriage')}>
          {errors.marriage && (
            <Text style={styles.error}>{errors.marriage?.message}</Text>
          )}
          <Controller
            control={control}
            name="marriage"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('marriage', {required: 'marriage is required'})}
                onSubmitEditing={() => setFocus('date')}
                autoCorrect={false}
                autoFocus={true}
                keyboardType="default"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="name"
                variant="outlined"
                label="marriage"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
        <Pressable onPress={() => setFocus('date')}>
          {errors.date && (
            <Text style={styles.error}>{errors.date?.message}</Text>
          )}
          <Controller
            control={control}
            name="date"
            render={({field}) => (
              <>
                <TextInput
                  {...field}
                  {...register('date', {required: 'date is required'})}
                  onSubmitEditing={onSubmit}
                  autoCorrect={false}
                  returnKeyType="done"
                  style={styles.textInput}
                  textContentType="none"
                  variant="outlined"
                  label="date"
                  onChangeText={value => field.onChange(value)}
                  value={field.value}
                  onFocus={() => {
                    setOpenDatePicker(true);
                  }}
                />
                <DatePicker
                  modal
                  mode={'date'}
                  open={openDatePicker}
                  date={new Date(control._formValues.date || Date.now())}
                  onConfirm={selectedDate => {
                    setOpenDatePicker(false);
                    field.onChange(selectedDate.toDateString());
                  }}
                  onCancel={() => {
                    setOpenDatePicker(false);
                  }}
                />
              </>
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
              onPress={deleteBhaai}
            />
            <SizedBox height={16} />
          </>
        )}
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddBhaai;
