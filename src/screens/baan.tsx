import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, Stack, Text} from '@react-native-material/core';

import useStyles from '../styles/baan';
import useStackBarStyles from '../styles/stackBar';
import {Baan as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddBaan from '../components/addBaan';
import ProgressBar from '../components/loader';
import {useQuery} from 'react-query';
import {BaanList} from '../types/BaanList';
import {BhaaiTotal} from '../types/BhaaiTotal';
import SwipeableList from '../components/swipeableList/swipeableList';

const childPageStates = ['edit', 'add'];

interface BaanProps {
  setBaanVisible: (visiblity: boolean) => any;
  bhaaiId: string;
}

const Baan: React.FC<BaanProps> = ({bhaaiId, setBaanVisible}) => {
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const [openDailog, setOpenDailog] = useState('');
  const [selectedBaan, setSelectedBaan] = useState({} as any);
  const [queryKey, setQueryKey] = useState(Date.now());
  const {data, isLoading} = useQuery(['baanList', bhaaiId, queryKey], () =>
    Promise.all([
      apiService.getBaanList(bhaaiId),
      apiService.getBhaai(bhaaiId, true),
    ]).then(([baanList, bhaaiData]: [BaanList, BhaaiTotal]) => ({
      baanList,
      bhaaiData,
    })),
  );

  const editItem = (baan: BaanType) => {
    setSelectedBaan(baan);
    setOpenDailog('edit');
  };

  const deleteBaan = async (id: string) => {
    return apiService.deleteBaan(id, bhaaiId).then(() => {
      if (data) {
        const index = data?.baanList.findIndex(a => a._id === id);
        data.baanList.splice(index, 1);
      }
      return true;
    });
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
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
          {data?.baanList && (
            <SwipeableList
              items={data.baanList.map(baan => {
                return {
                  title: `${baan.firstName} ${baan.lastName}${
                    baan.nickName ? '(' + baan.nickName + ')' : ''
                  } ${
                    baan.fathersName ? 'S/O Shri ' + baan.fathersName : ''
                  }, ${baan.address}`,
                  key: baan._id,
                  subtitle: `Rs: ${baan.amount}`,
                  leading: (
                    <TouchableOpacity onPress={() => editItem(baan)}>
                      <Ionicons
                        name="create-outline"
                        size={25}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteBaan}
              refreshing={isLoading}
              refresh={() => setQueryKey(Date.now())}
            />
          )}
          <Stack
            style={stackBarStyles.stackBarBottom}
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
                setOpenDailog('add');
              }}
              icon={props => <Ionicons name="add" {...props} />}
              color="secondary"
              style={stackBarStyles.fab}
            />
          </Stack>
        </View>
      )}
      {openDailog === 'add' && (
        <AddBaan
          setVisible={value => setOpenDailog(value ? 'add' : '')}
          type="ADD"
          bhaaiId={bhaaiId}
          invalidateData={setQueryKey}
        />
      )}
      {openDailog === 'edit' && (
        <AddBaan
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
          bhaaiId={bhaaiId}
          invalidateData={setQueryKey}
          data={selectedBaan}
        />
      )}
    </>
  );
};

export default Baan;
