import {Button, TextInput} from '@react-native-material/core';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import {useAppSelector} from '../redux/hooks';
import useStyles from '../styles/relative';
import {RelativeBase} from '../types/Relative';
import ScreenHeading from './ui/screenHeading';
import SizedBox from './ui/sizedBox';

interface ComponentProps {
  setVisible: (visiblity: string) => any;
  setFilterBy: (by: RelativeBase) => any;
  filterBy: RelativeBase;
}

const FilterRelative: React.FC<ComponentProps> = (props: ComponentProps) => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);
  const {control, handleSubmit, setFocus, register} = useForm<RelativeBase>({
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
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenHeading title={'filter relative'} />
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
                autoFocus={true}
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
                onSubmitEditing={() => setFocus('phoneNumber')}
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
        <Pressable onPress={() => setFocus('phoneNumber')}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({field}) => (
              <TextInput
                {...field}
                {...register('phoneNumber')}
                autoCapitalize="none"
                autoComplete="tel"
                autoCorrect={false}
                keyboardType="number-pad"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="telephoneNumber"
                variant="outlined"
                label="phoneNumber"
                onChangeText={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
        </Pressable>
        <Button title="apply" onPress={onSubmit} />
        <SizedBox height={16} />
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default FilterRelative;
