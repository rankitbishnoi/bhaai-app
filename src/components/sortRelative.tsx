import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
} from '@react-native-material/core';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useStyles from '../styles/profile';
import {BaanBase} from '../types/Baan';
import {Relative} from '../types/Relative';
import RadioButton from './radioButton';

type sortRelativeKeyType = keyof Relative;
type sortBaanKeyType = keyof BaanBase;

interface DialogOptions {
  visible: string;
  setVisible: (visiblity: string) => any;
  setSortBy: (reason?: sortRelativeKeyType & sortBaanKeyType) => any;
  sortBy: string;
}

const SortRelative: React.FC<DialogOptions> = (props: DialogOptions) => {
  const styles = useStyles();

  const close = () => {
    props.setSortBy();
    props.setVisible('');
  };

  const apply = () => {
    props.setVisible('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Dialog
        visible={props.visible === 'sort'}
        onDismiss={() => props.setVisible('')}>
        <DialogHeader title={'sort'} />
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            title="cancel"
            compact
            variant="text"
            onPress={close}
          />
          <Button title="apply" compact variant="text" onPress={apply} />
        </DialogActions>
      </Dialog>
    </KeyboardAvoidingView>
  );
};

export default SortRelative;
