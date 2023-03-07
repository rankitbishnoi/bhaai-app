import React, {useContext, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, ListItem, Stack} from '@react-native-material/core';

import useStyles from '../styles/nimta';
import {Nimta as NimtaType} from '../types/Nimta';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddNimta from '../components/addNimta';
import {Image} from 'react-native';
import ProgressBar from '../components/loader';
import AppContext from '../services/storage';
import {useQuery} from 'react-query';

const Nimta: React.FC = () => {
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedNimta, setSelectedNimta] = useState({} as any);
  const {data, isLoading} = useQuery(
    ['nimtaList', myContext.appSettings.selectedRole],
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
          {data &&
            data.map((nimta: NimtaType) => (
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
        {addVisible && (
          <AddNimta
            visible={addVisible}
            setVisible={setAddVisible}
            type="ADD"
            pariwarId={myContext.appSettings.selectedRole}
          />
        )}
        {editVisible && (
          <AddNimta
            visible={editVisible}
            setVisible={setEditVisible}
            type="EDIT"
            data={selectedNimta}
            pariwarId={myContext.appSettings.selectedRole}
          />
        )}
      </View>
    </>
  );
};

export default Nimta;
