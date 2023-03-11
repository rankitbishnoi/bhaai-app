import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
  TextInput,
} from '@react-native-material/core';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, Platform, Pressable} from 'react-native';
import useStyles from '../styles/baan';
import {BaanBase} from '../types/Baan';

interface DialogOptions {
  visible: string;
  setVisible: (visiblity: string) => any;
  setFilterBy: (by: BaanBase) => any;
  filterBy: BaanBase;
}

const FilterBaan: React.FC<DialogOptions> = (props: DialogOptions) => {
  const styles = useStyles();
  const {control, handleSubmit, setFocus, register} = useForm<BaanBase>({
    defaultValues: props.filterBy || {
      firstName: '',
      lastName: '',
      nickName: '',
      fathersName: '',
      address: '',
      amount: 0,
    },
  });
  useEffect(() => {
    setFocus('firstName');
  }, [setFocus]);
  const onSubmit = handleSubmit((input: BaanBase) => {
    props.setFilterBy(input);
    props.setVisible('');
  });

  const close = () => {
    props.setFilterBy({} as any);
    props.setVisible('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog
        visible={props.visible === 'filter'}
        onDismiss={() => props.setVisible('')}>
        <DialogHeader title={'filter'} />
        <DialogContent>
          <Pressable onPress={() => setFocus('firstName')}>
            <Controller
              control={control}
              name="firstName"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('firstName')}
                  onSubmitEditing={() => setFocus('lastName')}
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  style={styles.textInput}
                  textContentType="name"
                  variant="outlined"
                  label="firstName"
                  onChangeText={value => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
          </Pressable>
          <Pressable onPress={() => setFocus('lastName')}>
            <Controller
              control={control}
              name="lastName"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('lastName')}
                  onSubmitEditing={() => setFocus('nickName')}
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  style={styles.textInput}
                  textContentType="name"
                  variant="outlined"
                  label="lastName"
                  onChangeText={value => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
          </Pressable>
          <Pressable onPress={() => setFocus('nickName')}>
            <Controller
              control={control}
              name="nickName"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('nickName')}
                  onSubmitEditing={() => setFocus('fathersName')}
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  style={styles.textInput}
                  textContentType="name"
                  variant="outlined"
                  label="nickName"
                  onChangeText={value => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
          </Pressable>
          <Pressable onPress={() => setFocus('fathersName')}>
            <Controller
              control={control}
              name="fathersName"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('fathersName')}
                  onSubmitEditing={() => setFocus('address')}
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  style={styles.textInput}
                  textContentType="name"
                  variant="outlined"
                  label="fathersName"
                  onChangeText={value => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
          </Pressable>
          <Pressable onPress={() => setFocus('address')}>
            <Controller
              control={control}
              name="address"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('address')}
                  onSubmitEditing={() =>
                    setFocus('amount', {shouldSelect: true})
                  }
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  style={styles.textInput}
                  textContentType="name"
                  variant="outlined"
                  label="address"
                  onChangeText={value => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
          </Pressable>
          <Pressable onPress={() => setFocus('amount', {shouldSelect: true})}>
            <Controller
              control={control}
              name="amount"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('amount')}
                  autoCapitalize="none"
                  autoComplete="tel"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  variant="outlined"
                  label="amount"
                  style={styles.textInput}
                  textContentType="telephoneNumber"
                  onChangeText={value => field.onChange(value)}
                  value={field.value.toString()}
                />
              )}
            />
          </Pressable>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            title="cancel"
            compact
            variant="text"
            onPress={close}
          />
          <Button title="apply" compact variant="text" onPress={onSubmit} />
        </DialogActions>
      </Dialog>
    </KeyboardAvoidingView>
  );
};

export default FilterBaan;