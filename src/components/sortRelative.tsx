import {Button, Stack, Text} from '@react-native-material/core';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import useStyles from '../styles/profile';
import {BaanBase} from '../types/Baan';
import {Relative} from '../types/Relative';
import RadioButton from './radioButton';
import SizedBox from './SizedBox';

type sortRelativeKeyType = keyof Relative;
type sortBaanKeyType = keyof BaanBase;

interface ComponentProps {
  setVisible: (visiblity: string) => any;
  setSortBy: (reason?: sortRelativeKeyType & sortBaanKeyType) => any;
  sortBy: string;
}

const SortRelative: React.FC<ComponentProps> = (props: ComponentProps) => {
  const styles = useStyles();

  const close = () => {
    props.setSortBy();
    props.setVisible('');
  };

  const apply = () => {
    props.setVisible('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Stack m={4} spacing={4}>
          <Text style={styles.heading} variant="button">
            {'sort'}
          </Text>
        </Stack>
        <View style={styles.labelContainer}>
          <TouchableOpacity onPress={() => props.setSortBy('firstName')}>
            <RadioButton selected={props.sortBy === 'firstName'} />
          </TouchableOpacity>
          <Text style={styles.labelData}>first name</Text>
        </View>
        <View style={styles.labelContainer}>
          <TouchableOpacity onPress={() => props.setSortBy('fathersName')}>
            <RadioButton selected={props.sortBy === 'fathersName'} />
          </TouchableOpacity>
          <Text style={styles.labelData}>father's name</Text>
        </View>
        <View style={styles.labelContainer}>
          <TouchableOpacity onPress={() => props.setSortBy('address')}>
            <RadioButton selected={props.sortBy === 'address'} />
          </TouchableOpacity>
          <Text style={styles.labelData}>address</Text>
        </View>
        <Button title="apply" onPress={apply} />
        <SizedBox height={16} />
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default SortRelative;
