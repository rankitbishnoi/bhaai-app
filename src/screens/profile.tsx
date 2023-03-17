import {
  IconButton,
  ListItem,
  Pressable,
  Stack,
  Switch,
  Text,
} from '@react-native-material/core';
import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddPariwar from '../components/addPariwar';
import ProgressBar from '../components/ui/loader';
import RadioButton from '../components/ui/radioButton';

import useStyles from '../styles/profile';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import {PariwarRole} from '../types/Profile';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  logoutthunk,
  selectPariwar,
  updateAvatar,
  useGetProfileQuery,
} from '../redux/features/slices/profile-slice';
import {themeColor, toggleTheme} from '../redux/features/slices/theme-slice';
import {Avatar} from '../components/ui/avatar';
import {ImageOrVideo} from 'react-native-image-crop-picker';

const childPageStates = ['edit', 'add'];

const Profile: React.FC = () => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);
  const stackBarStyles = useStackBarStyles(theme);
  const buttonStyles = useButtonStyles(theme);
  const [openDailog, setOpenDailog] = useState('');
  const [selectedRole, setSelectedRole] = useState({} as any);
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.profile.user);
  const avatar = useAppSelector(state => state.profile.avatar);
  const selectedPariwar =
    useAppSelector(state => state.profile.selectedPariwar) || '';
  const {isLoading, refetch} = useGetProfileQuery();

  const selectPariwarRole = (id: string) => {
    dispatch(selectPariwar(id));
  };

  const editItem = (role: PariwarRole) => {
    setSelectedRole(role);
    setOpenDailog('edit');
  };

  const handleLogout = () => {
    dispatch(logoutthunk());
  };

  const onAvatarChange = (image: ImageOrVideo) => {
    dispatch(updateAvatar(image.path));
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
              <Avatar
                onChange={onAvatarChange}
                name={data?.email}
                source={{uri: avatar}}
              />
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
              <TouchableOpacity onPress={handleLogout}>
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
                  value={theme === themeColor.DARK}
                  onValueChange={() => {
                    dispatch(toggleTheme());
                  }}
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
                        selected={role.pariwarId._id === selectedPariwar}
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
          refetch={refetch}
        />
      )}
      {openDailog === 'edit' && (
        <AddPariwar
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
          data={selectedRole.pariwarId}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Profile;
