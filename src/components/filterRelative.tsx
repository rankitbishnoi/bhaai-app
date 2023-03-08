import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
} from '@react-native-material/core';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import useStyles from '../styles/relative';
import {RelativeBase} from '../types/Relative';
import SizedBox from './SizedBox';

interface DialogOptions {
  visible: string;
  setVisible: (visiblity: string) => any;
  setFilterBy: (by: RelativeBase) => any;
  filterBy: RelativeBase;
}

const FilterRelative: React.FC<DialogOptions> = (props: DialogOptions) => {
  const styles = useStyles();
  const {control, handleSubmit} = useForm<RelativeBase>({
    defaultValues: props.filterBy || {
      firstName: '',
      lastName: '',
      nickName: '',
      fathersName: '',
      address: '',
      phoneNumber: '',
    },
  });

  const onSubmit = handleSubmit((input: RelativeBase) => {
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
        <DialogHeader title={'sort'} />
        <DialogContent>
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>first name</Text>
              <Controller
                control={control}
                name="firstName"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
                    onChangeText={value => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>last name</Text>
              <Controller
                control={control}
                name="lastName"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
                    onChangeText={value => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>nick name</Text>
              <Controller
                control={control}
                name="nickName"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
                    onChangeText={value => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>father's name</Text>
              <Controller
                control={control}
                name="fathersName"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
                    onChangeText={value => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />
          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>address</Text>
              <Controller
                control={control}
                name="address"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="name"
                    onChangeText={value => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />

          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>phone number</Text>
              <Controller
                control={control}
                name="phoneNumber"
                render={({field}) => (
                  <TextInput
                    {...field}
                    autoCapitalize="none"
                    autoComplete="tel"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="telephoneNumber"
                    onChangeText={value => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />
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

export default FilterRelative;
