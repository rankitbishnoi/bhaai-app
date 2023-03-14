import {
  IconButton,
  ListItem,
  Pressable,
  Stack,
  Switch,
  Text,
} from '@react-native-material/core';
import React, {useContext, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useQuery} from 'react-query';
import AddPariwar from '../components/addPariwar';
import ProgressBar from '../components/ui/loader';
import RadioButton from '../components/ui/radioButton';
import {apiService} from '../services/api.service';
import mmkv from '../services/mmkv';
import AppContext from '../services/storage';

import useStyles from '../styles/profile';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import {PariwarRole} from '../types/Profile';
import {
  AppContextState,
  APP_ACTIONS,
  themeColor,
} from '../services/app.reducer';

const childPageStates = ['edit', 'add'];

const Profile: React.FC = () => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  const stackBarStyles = useStackBarStyles(myContext.appSettings.theme);
  const buttonStyles = useButtonStyles(myContext.appSettings.theme);
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

  const toggleTheme = () => {
    myContext.dispatch({type: APP_ACTIONS.TOGGLE_THEME});
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
              <Text style={styles.labelContainer}>Theme</Text>
              <Stack style={stackBarStyles.stackBar} m={0} spacing={0}>
                <Pressable onPress={() => setOpenDailog('addFromBaan')}>
                  <Text
                    style={stackBarStyles.stackBarHeadings}
                    variant="button">
                    light
                  </Text>
                </Pressable>
                <Switch
                  thumbColor={stackBarStyles.toggleColor.thumb}
                  trackColor={{
                    true: stackBarStyles.toggleColor.active,
                    false: stackBarStyles.toggleColor.inactive,
                  }}
                  value={myContext.appSettings.theme === themeColor.DARK}
                  onValueChange={toggleTheme}
                />
                <Pressable onPress={() => setOpenDailog('addFromRelative')}>
                  <Text
                    style={stackBarStyles.stackBarHeadings}
                    variant="button">
                    dark
                  </Text>
                </Pressable>
              </Stack>
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
                        <Ionicons
                          name="chevron-forward-outline"
                          {...props}
                          color={stackBarStyles.iconColor.color}
                        />
                      </TouchableOpacity>
                    )}
                  />
                ))}
              </ScrollView>
              <Stack
                style={stackBarStyles.stackBarBottom}
                fill
                bottom={0}
                spacing={0}>
                <View />
                <IconButton
                  onPress={() => {
                    setOpenDailog('add');
                  }}
                  icon={props => (
                    <Ionicons
                      name="add"
                      {...props}
                      color={stackBarStyles.iconColor.color}
                    />
                  )}
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
