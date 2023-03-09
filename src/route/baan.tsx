import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, ListItem, Stack, Text} from '@react-native-material/core';

import useStyles from '../styles/baan';
import useStackBarStyles from '../styles/stackBar';
import {Baan as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddBaan from '../components/addBaan';
import {Image} from 'react-native';
import ProgressBar from '../components/loader';
import AppContext from '../services/storage';

interface BaanProps {
  setBaanVisible: (visiblity: boolean) => any;
  bhaaiId: string;
}

const Baan: React.FC<BaanProps> = ({bhaaiId, setBaanVisible}) => {
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const [data, setData] = useState({} as any);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedBaan, setSelectedBaan] = useState({} as any);
  const [loading, setLoading] = useState(true);

  const editItem = (baan: BaanType) => {
    setSelectedBaan(baan);
    setEditVisible(true);
  };

  const getData = useCallback(async () => {
    setLoading(true);
    const baanList = await apiService.getBaanList({} as any, bhaaiId);
    const bhaaiData = await apiService.getBhaai(bhaaiId, true);
    setData({baanList, bhaaiData});
    setLoading(false);
  }, [bhaaiId]);

  useEffect(() => {
    getData();
  }, [getData]);

  const reloadData = (reason: string) => {
    if (reason === 'EDIT') {
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Baan has been updated',
      });
    } else if (reason === 'ADD') {
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Baan has been added',
      });
    } else if (reason === 'DELETE') {
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Baan has been deleted',
      });
    }
    getData();
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
      )}
      {data?.bhaaiData && (
        <Stack m={4} spacing={4}>
          <Text style={styles.heading} variant="button">
            {data.bhaaiData.marriage}
          </Text>
          <Text style={styles.heading} variant="overline">
            Rs: {data.bhaaiData.total}
          </Text>
        </Stack>
      )}
      <ScrollView>
        {data?.baanList &&
          data.baanList.map((baan: BaanType) => (
            <ListItem
              key={baan._id}
              title={`${baan.firstName} ${baan.lastName}${
                baan.nickName ? '(' + baan.nickName + ')' : ''
              } ${baan.fathersName ? 'S/O ' + baan.fathersName : ''}, ${
                baan.address
              }`}
              secondaryText={`Rs: ${baan.amount}`}
              style={styles.list}
              elevation={4}
              leadingMode="image"
              leading={
                <TouchableOpacity onPress={() => editItem(baan)}>
                  <Image
                    source={require('../assets/edit-icon.png')}
                    style={{width: 50, height: 50}}
                  />
                </TouchableOpacity>
              }
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
            setBaanVisible(false);
          }}
          icon={props => <Ionicons name="arrow-back-outline" {...props} />}
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
        <AddBaan
          visible={addVisible}
          setVisible={setAddVisible}
          type="ADD"
          bhaaiId={bhaaiId}
          reloadList={reloadData}
        />
      )}
      {editVisible && (
        <AddBaan
          visible={editVisible}
          setVisible={setEditVisible}
          type="EDIT"
          bhaaiId={bhaaiId}
          reloadList={reloadData}
          data={selectedBaan}
        />
      )}
    </View>
  );
};

export default Baan;
