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
import {PariwarRole} from '../types/Profile';

const Profile: React.FC = () => {
  const styles = useStyles();
  const myContext = useContext(AppContext);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState({} as any);
  const {data, isLoading, isError, error} = useQuery('profile', () =>
    apiService.getProfile(),
  );

  const logout = () => {
    mmkv.deleteJWT();
    myContext.setAppSettings({isLoggedIn: false});
  };

  const selectPariwarRole = (id: string) => {
    myContext.setAppSettings({
      ...myContext.appSettings,
      selectedRole: id,
    });
  };

  const editItem = (role: PariwarRole) => {
    setSelectedRole(role);
    setEditVisible(true);
  };

  return (
    <View style={styles.conatiner}>
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
          <Text style={styles.labelContainer}>Roles</Text>
          <ScrollView>
            {isError && <Text>Error: {(error as any).message}</Text>}
            {data?.pariwarRoles.map((role: PariwarRole) => (
              <ListItem
                key={role._id}
                title={role._id}
                style={styles.list}
                elevation={4}
                leadingMode="image"
                leading={
                  <TouchableOpacity
                    onPress={() => selectPariwarRole(role.pariwarId)}>
                    <RadioButton
                      selected={
                        role.pariwarId === myContext.appSettings.selectedRole
                      }
                    />
                  </TouchableOpacity>
                }
                trailing={props => (
                  <TouchableOpacity onPress={() => editItem(role)}>
                    <Ionicons name="chevron-forward-outline" {...props} />
                  </TouchableOpacity>
                )}
              />
            ))}
          </ScrollView>
          {addVisible && (
            <AddPariwar
              visible={addVisible}
              setVisible={setAddVisible}
              type="ADD"
            />
          )}
          {editVisible && (
            <AddPariwar
              visible={editVisible}
              setVisible={setEditVisible}
              type="EDIT"
              data={selectedRole}
            />
          )}
          <Stack fill bottom={1} right={1} spacing={4}>
            <IconButton
              onPress={() => {
                setAddVisible(!addVisible);
              }}
              icon={props => <Ionicons name="add" {...props} />}
              color="secondary"
              style={styles.fab}
            />
          </Stack>
        </>
      )}
      <TouchableOpacity onPress={logout}>
        <View style={styles.button}>
          <Text style={styles.buttonTitle}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
