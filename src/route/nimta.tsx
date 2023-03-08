import React, {useContext, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, ListItem, Stack} from '@react-native-material/core';

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

const Nimta: React.FC = () => {
  const myContext = useContext(AppContext);
  const navigation = useNavigation();
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const buttonStyles = useButtonStyles();
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedNimta, setSelectedNimta] = useState({} as any);
  const [queryKey, setQueryKey] = useState(Date.now());
  const {data, isLoading} = useQuery(
    ['nimtaList', myContext.appSettings.selectedRole, queryKey],
    () => apiService.getNimtaList(myContext.appSettings.selectedRole),
  );

  const editItem = (nimta: NimtaType) => {
    setSelectedNimta(nimta);
    setEditVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
        {isLoading && (
          <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
        )}
        <ScrollView>
          {!myContext.appSettings.selectedRole && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('profile');
              }}>
              <View style={buttonStyles.button}>
                <Text style={buttonStyles.buttonTitle}>select pariwar</Text>
              </View>
            </TouchableOpacity>
          )}
          {data?.map((nimta: NimtaType) => (
            <ListItem
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
              setAddVisible(!addVisible);
            }}
            icon={props => <Ionicons name="add" {...props} />}
            color="secondary"
            style={stackBarStyles.fab}
          />
        </Stack>
        {addVisible && (
          <AddNimta
            visible={addVisible}
            setVisible={setAddVisible}
            type="ADD"
            pariwarId={myContext.appSettings.selectedRole}
            invalidateData={setQueryKey}
          />
        )}
        {editVisible && (
          <AddNimta
            visible={editVisible}
            setVisible={setEditVisible}
            type="EDIT"
            data={selectedNimta}
            pariwarId={myContext.appSettings.selectedRole}
            invalidateData={setQueryKey}
          />
        )}
      </View>
    </>
  );
};

export default Nimta;
