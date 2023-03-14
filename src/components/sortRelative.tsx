import {Button, Text} from '@react-native-material/core';
import React, {useContext} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppContextState} from '../services/app.reducer';
import AppContext from '../services/storage';
import useStyles from '../styles/profile';
import {BaanBase} from '../types/Baan';
import {Relative} from '../types/Relative';
import RadioButton from './ui/radioButton';
import ScreenHeading from './ui/screenHeading';
import SizedBox from './ui/sizedBox';

type sortRelativeKeyType = keyof Relative;
type sortBaanKeyType = keyof BaanBase;

interface ComponentProps {
  setVisible: (visiblity: string) => any;
  setSortBy: (reason?: sortRelativeKeyType & sortBaanKeyType) => any;
  sortBy: string;
}

const SortRelative: React.FC<ComponentProps> = (props: ComponentProps) => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);

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
        <ScreenHeading title={'sort'} />
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
