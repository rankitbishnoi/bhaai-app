import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, Stack, Text} from '@react-native-material/core';
import useStyles from '../styles/bhaai';
import useStackBarStyles from '../styles/stackBar';
import {Bhaai as BhaaiType} from '../types/Bhaai';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddBhaai from '../components/addBhaai';
import {Image} from 'react-native';
import Baan from './baan';
import ProgressBar from '../components/loader';
import Search from './search';
import {useQuery} from 'react-query';
import SwipeableList from '../components/swipeableList/swipeableList';

const childPageStates = ['baan-list', 'search', 'edit', 'add'];

const Bhaai: React.FC = () => {
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const [selectedBhaai, setSelectedBhaai] = useState({} as any);
  const [openDailog, setOpenDailog] = useState('');
  const [queryKey, setQueryKey] = useState(Date.now());
  const {data, isLoading} = useQuery(['baanList', queryKey], () =>
    apiService.getBhaaiList(),
  );

  const editItem = (bhaai: BhaaiType) => {
    setSelectedBhaai(bhaai);
    setOpenDailog('edit');
  };

  const openItem = (bhaai: BhaaiType) => {
    setSelectedBhaai(bhaai);
    setOpenDailog('baan-list');
  };

  const deleteBhaai = async (id: string) => {
    return apiService.deleteBhaai(id).then(() => {
      if (data) {
        const index = data?.findIndex(a => a._id === id);
        data.splice(index, 1);
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
          <Stack m={4} spacing={4}>
            <Text style={styles.heading} variant="button">
              Bhaai List
            </Text>
          </Stack>
          {data && (
            <SwipeableList
              items={data.map(bhaaiItem => {
                return {
                  title: bhaaiItem.marriage,
                  key: bhaaiItem._id,
                  onPress: () => openItem(bhaaiItem),
                  subtitle: new Date(bhaaiItem.date).toDateString(),
                  leading: (
                    <TouchableOpacity onPress={() => editItem(bhaaiItem)}>
                      <Image
                        source={require('../assets/edit-icon.png')}
                        style={{width: 50, height: 50}}
                      />
                    </TouchableOpacity>
                  ),
                  trailing: (
                    <TouchableOpacity onPress={() => openItem(bhaaiItem)}>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={25}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteBhaai}
              refreshing={isLoading}
              refresh={() => setQueryKey(Date.now())}
            />
          )}
          <Stack
            style={stackBarStyles.stackBar}
            fill
            bottom={1}
            right={1}
            spacing={4}>
            <IconButton
              onPress={() => {
                setOpenDailog('search');
              }}
              icon={props => <Ionicons name="search" {...props} />}
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
        <AddBhaai
          setVisible={value => setOpenDailog(value ? 'add' : '')}
          type="ADD"
          invalidateData={setQueryKey}
        />
      )}
      {openDailog === 'edit' && (
        <AddBhaai
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
          invalidateData={setQueryKey}
          data={selectedBhaai}
        />
      )}
      {openDailog === 'baan-list' && (
        <Baan
          bhaaiId={selectedBhaai._id}
          setBaanVisible={value => setOpenDailog(value ? 'baan-list' : '')}
        />
      )}
      {openDailog === 'search' && (
        <Search
          setSearchVisible={value => setOpenDailog(value ? 'search' : '')}
          invalidateData={setQueryKey}
        />
      )}
    </>
  );
};

export default Bhaai;
