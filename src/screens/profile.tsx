import {IconButton, ListItem, Stack} from '@react-native-material/core';
import React, {useContext, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useQuery} from 'react-query';
import AddPariwar from '../components/addPariwar';
import ProgressBar from '../components/loader';
import RadioButton from '../components/radioButton';
import {apiService} from '../services/api.service';
import mmkv from '../services/mmkv';
import AppContext from '../services/storage';

import useStyles from '../styles/profile';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import {PariwarRole} from '../types/Profile';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';

const childPageStates = ['edit', 'add'];

const Profile: React.FC = () => {
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const buttonStyles = useButtonStyles();
  const myContext = useContext<AppContextState>(AppContext);
  const [openDailog, setOpenDailog] = useState('');
  const [selectedRole, setSelectedRole] = useState({} as any);
  const {data, isLoading, isError, error} = useQuery(
    ['profile', myContext.appSettings.queryState.profile],
    () => apiService.getProfile(),
  );

  const logout = () => {
    mmkv.deleteJWT();
    myContext.dispatch({type: APP_ACTIONS.LOGOUT});
  };

  const selectPariwarRole = (id: string) => {
    myContext.dispatch({
      type: APP_ACTIONS.SELECT_PARIWAR,
      payload: id,
    });
  };

  const editItem = (role: PariwarRole) => {
    setSelectedRole(role);
    setOpenDailog('edit');
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          {data && (
            <>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.labelData}>{data?.email}</Text>
              </View>
              {data?.phoneNumber && (
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Mobile:</Text>
                  <Text style={styles.labelData}>{data?.phoneNumber}</Text>
                </View>
              )}
              <TouchableOpacity onPress={logout}>
                <View style={buttonStyles.buttonSecondary}>
                  <Text style={buttonStyles.buttonTitle}>logout</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.labelContainer}>Pariwar</Text>
              <ScrollView>
                {data?.pariwarRoles.length === 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setOpenDailog('add');
                    }}>
                    <View style={buttonStyles.button}>
                      <Text style={buttonStyles.buttonTitle}>
                        create pariwar
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {isError && <Text>Error: {(error as any).message}</Text>}
                {data?.pariwarRoles.map((role: PariwarRole) => (
                  <ListItem
                    onPress={() => selectPariwarRole(role.pariwarId._id)}
                    key={role._id}
                    title={role.pariwarId.name}
                    style={styles.list}
                    elevation={4}
                    leadingMode="icon"
                    leading={
                      <RadioButton
                        selected={
                          role.pariwarId._id ===
                          myContext.appSettings.selectedPariwar
                        }
                      />
                    }
                    trailing={props => (
                      <TouchableOpacity onPress={() => editItem(role)}>
                        <Ionicons name="chevron-forward-outline" {...props} />
                      </TouchableOpacity>
                    )}
                  />
                ))}
              </ScrollView>
              <Stack
                style={stackBarStyles.stackBarBottom}
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
            </>
          )}
        </View>
      )}
      {openDailog === 'add' && (
        <AddPariwar
          setVisible={value => setOpenDailog(value ? 'add' : '')}
          type="ADD"
        />
      )}
      {openDailog === 'edit' && (
        <AddPariwar
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
          data={selectedRole.pariwarId}
        />
      )}
    </>
  );
};

export default Profile;
