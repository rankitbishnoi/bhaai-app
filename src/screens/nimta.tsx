import React, {useContext, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {apiService} from '../services/api.service';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  IconButton,
  ListItem,
  Stack,
} from '@react-native-material/core';

import useStyles from '../styles/nimta';
import useStackBarStyles from '../styles/stackBar';
import {Nimta as NimtaType} from '../types/Nimta';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddNimta from '../components/addNimta';
import {Image} from 'react-native';
import ProgressBar from '../components/loader';
import AppContext from '../services/storage';
import {useQuery} from 'react-query';
import useButtonStyles from '../styles/button';
import {useNavigation} from '@react-navigation/native';
import Relative from './relative';
import AddFromRelative from '../components/addFromRelative';
import AddFromBaan from '../components/addFromBaan';
import SizedBox from '../components/SizedBox';

const childPageStates = ['relative', 'addFromRelative', 'addFromBaan'];

const Nimta: React.FC = () => {
  const myContext = useContext(AppContext);
  const navigation = useNavigation();
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const buttonStyles = useButtonStyles();
  const [openDailog, setOpenDailog] = useState('');
  const [selectedNimta, setSelectedNimta] = useState({} as any);
  const [queryKey, setQueryKey] = useState(Date.now());
  const {data, isLoading} = useQuery(
    ['nimtaList', myContext.appSettings.selectedRole, queryKey],
    () => apiService.getNimtaList(myContext.appSettings.selectedRole),
  );

  const editItem = (nimta: NimtaType) => {
    setSelectedNimta(nimta);
    setOpenDailog('edit');
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          <ScrollView>
            {!myContext.appSettings.selectedRole && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('profile' as never);
                }}>
                <View style={buttonStyles.button}>
                  <Text style={buttonStyles.buttonTitle}>select pariwar</Text>
                </View>
              </TouchableOpacity>
            )}
            {data?.map((nimta: NimtaType) => (
              <ListItem
                onPress={() => {
                  setSelectedNimta(nimta);
                  setOpenDailog('relative');
                }}
                key={nimta._id}
                title={nimta.name}
                secondaryText={`Relatives: ${nimta.relative.length}`}
                style={styles.list}
                elevation={4}
                leadingMode="image"
                leading={
                  <TouchableOpacity onPress={() => editItem(nimta)}>
                    <Image
                      source={require('../assets/edit-icon.png')}
                      style={{width: 50, height: 50}}
                    />
                  </TouchableOpacity>
                }
                trailing={props => (
                  <Ionicons name="chevron-forward-outline" {...props} />
                )}
              />
            ))}
          </ScrollView>
          <Stack
            style={stackBarStyles.stackBar}
            fill
            bottom={1}
            right={1}
            spacing={4}>
            <View />
            <IconButton
              onPress={() => {
                setOpenDailog('add');
              }}
              icon={props => <Ionicons name="add" {...props} />}
              color="secondary"
              style={stackBarStyles.fab}
            />
          </Stack>
          {openDailog === 'add' && (
            <AddNimta
              visible={openDailog === 'add'}
              setVisible={value => setOpenDailog(value ? 'add' : '')}
              type="ADD"
              pariwarId={myContext.appSettings.selectedRole}
              invalidateData={setQueryKey}
            />
          )}
          {openDailog === 'edit' && (
            <AddNimta
              visible={openDailog === 'edit'}
              setVisible={value => setOpenDailog(value ? 'edit' : '')}
              type="EDIT"
              data={selectedNimta}
              pariwarId={myContext.appSettings.selectedRole}
              invalidateData={setQueryKey}
            />
          )}
        </View>
      )}
      {openDailog === 'relative' && (
        <Relative
          relatives={selectedNimta.relative}
          nimtaBase={true}
          setVisible={value => setOpenDailog(value)}
        />
      )}
      {openDailog === 'addFromRelative' && (
        <AddFromRelative
          nimtaId={selectedNimta._id}
          invalidateData={setQueryKey}
          setVisible={value => setOpenDailog(value)}
        />
      )}
      {openDailog === 'addFromBaan' && (
        <AddFromBaan
          nimtaId={selectedNimta._id}
          invalidateData={setQueryKey}
          setVisible={value => setOpenDailog(value)}
        />
      )}
      {openDailog === 'addFromWhere' && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Dialog
            visible={openDailog === 'addFromWhere'}
            onDismiss={() => setOpenDailog('')}>
            <DialogHeader title={'add from where'} />
            <DialogContent>
              <Button
                color="primary"
                title="baan"
                onPress={() => setOpenDailog('addFromBaan')}
              />
              <SizedBox height={16} />
              <Button
                color="primary"
                title="relative"
                onPress={() => setOpenDailog('addFromRelative')}
              />
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                title="cancel"
                compact
                variant="text"
                onPress={() => setOpenDailog('')}
              />
            </DialogActions>
          </Dialog>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default Nimta;
