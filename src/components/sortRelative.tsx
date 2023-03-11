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
        <TouchableOpacity onPress={() => props.setSortBy('firstName')}>
          <View style={styles.labelContainer}>
            <RadioButton selected={props.sortBy === 'firstName'} />
            <Text style={styles.labelData}>first name</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.setSortBy('fathersName')}>
          <View style={styles.labelContainer}>
            <RadioButton selected={props.sortBy === 'fathersName'} />
            <Text style={styles.labelData}>father's name</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.setSortBy('address')}>
          <View style={styles.labelContainer}>
            <RadioButton selected={props.sortBy === 'address'} />
            <Text style={styles.labelData}>address</Text>
          </View>
        </TouchableOpacity>
        <Button title="apply" onPress={apply} />
        <SizedBox height={16} />
        <Button color="secondary" title="cancel" onPress={close} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default SortRelative;
