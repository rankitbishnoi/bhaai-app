import React, {useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, Stack} from '@react-native-material/core';
import useStyles from '../styles/bhaai';
import useStackBarStyles from '../styles/stackBar';
import {Bhaai as BhaaiType} from '../types/Bhaai';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddBhaai from '../components/addBhaai';
import Baan from './baan';
import ProgressBar from '../components/ui/loader';
import Search from './search';
import {useQuery} from 'react-query';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';
import AppContext from '../services/storage';

const childPageStates = ['baan-list', 'search', 'edit', 'add'];

const Bhaai: React.FC = () => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const [selectedBhaai, setSelectedBhaai] = useState({} as any);
  const [openDailog, setOpenDailog] = useState('');
  const {data, isLoading} = useQuery(
    ['baanList', myContext.appSettings.queryState.bhaaiList],
    () => apiService.getBhaaiList(),
  );

  const editItem = (bhaai: BhaaiType) => {
    setSelectedBhaai(bhaai);
    setOpenDailog('edit');
  };

  const openItem = (bhaai: BhaaiType) => {
    setSelectedBhaai(bhaai);
    setOpenDailog('baan-list');
  };

  const refresh = () => {
    myContext.dispatch({type: APP_ACTIONS.REFETCH_BHAAI_LIST});
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
          <ScreenHeading title="Bhaai List" />
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
                      <Ionicons
                        name="create-outline"
                        size={25}
                        color={'white'}
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
              refresh={refresh}
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
        />
      )}
      {openDailog === 'edit' && (
        <AddBhaai
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
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
        />
      )}
    </>
  );
};

export default Bhaai;
