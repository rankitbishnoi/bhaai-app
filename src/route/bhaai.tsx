import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, ListItem, Stack} from '@react-native-material/core';

import useStyles from '../styles/bhaai';
import useStackBarStyles from '../styles/stackBar';
import {Bhaai as BhaaiType} from '../types/Bhaai';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddBhaai from '../components/addBhaai';
import {Image} from 'react-native';
import Baan from './baan';
import ProgressBar from '../components/loader';
import Search from './search';
import AppContext from '../services/storage';

const Bhaai: React.FC = () => {
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const [data, setData] = useState([] as any);
  const [searchVisible, setSearchVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [baanVisible, setBaanVisible] = useState(false);
  const [selectedBhaai, setSelectedBhaai] = useState({} as any);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    apiService.getBhaaiList().then(result => {
      setData(result);
      setLoading(false);
      return result;
    });
  };

  const editItem = (bhaai: BhaaiType) => {
    setSelectedBhaai(bhaai);
    setEditVisible(true);
  };

  const openItem = (bhaai: BhaaiType) => {
    setSelectedBhaai(bhaai);
    setBaanVisible(true);
  };

  useEffect(() => {
    return getData();
  }, []);

  const reloadData = (reason: string) => {
    if (reason === 'EDIT') {
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Bhaai has been updated',
      });
    } else if (reason === 'ADD') {
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Bhaai has been added',
      });
    } else if (reason === 'DELETE') {
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Bhaai has been deleted',
      });
    }
    getData();
  };

  return (
    <>
      {!baanVisible && !searchVisible && (
        <View style={styles.container}>
          {loading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          <ScrollView>
            {data &&
              !baanVisible &&
              data.map((bhaai: BhaaiType) => (
                <ListItem
                  onPress={() => {
                    openItem(bhaai);
                  }}
                  key={bhaai._id}
                  title={bhaai.marriage}
                  secondaryText={new Date(bhaai.date).toDateString()}
                  style={styles.list}
                  elevation={4}
                  leadingMode="image"
                  leading={
                    <TouchableOpacity onPress={() => editItem(bhaai)}>
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
            <IconButton
              onPress={() => {
                setSearchVisible(!addVisible);
              }}
              icon={props => <Ionicons name="search" {...props} />}
              color="secondary"
              style={stackBarStyles.fab}
            />
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
            <AddBhaai
              visible={addVisible}
              setVisible={setAddVisible}
              type="ADD"
              reloadList={reloadData}
            />
          )}
          {editVisible && (
            <AddBhaai
              visible={editVisible}
              setVisible={setEditVisible}
              type="EDIT"
              reloadList={reloadData}
              data={selectedBhaai}
            />
          )}
        </View>
      )}
      {baanVisible && (
        <Baan bhaaiId={selectedBhaai._id} setBaanVisible={setBaanVisible} />
      )}
      {searchVisible && (
        <Search setSearchVisible={setSearchVisible} reloadList={getData} />
      )}
    </>
  );
};

export default Bhaai;
