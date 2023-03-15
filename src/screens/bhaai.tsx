import React, {useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Stack} from '@react-native-material/core';
import useStyles from '../styles/bhaai';
import useStackBarStyles from '../styles/stackBar';
import {Bhaai as BhaaiType} from '../types/Bhaai';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddBhaai from '../components/addBhaai';
import Baan from './baan';
import ProgressBar from '../components/ui/loader';
import Search from './search';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {AppContextState} from '../services/app.reducer';
import AppContext from '../services/storage';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  useGetBhaaiListQuery,
  deletedBhaai,
} from '../redux/features/bhaai/bhaai-slice';

const childPageStates = ['baan-list', 'search', 'edit', 'add'];

const Bhaai: React.FC = () => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  const stackBarStyles = useStackBarStyles(myContext.appSettings.theme);
  const [selectedBhaai, setSelectedBhaai] = useState({} as any);
  const [openDailog, setOpenDailog] = useState('');
  const data = useAppSelector(state => state.bhaaiList);
  const dispatch = useAppDispatch();
  const {isLoading, refetch} = useGetBhaaiListQuery();

  const editItem = (bhaai: BhaaiType) => {
    setSelectedBhaai(bhaai);
    setOpenDailog('edit');
  };

  const openItem = (bhaai: BhaaiType) => {
    setSelectedBhaai(bhaai);
    setOpenDailog('baan-list');
  };

  const deleteBhaai = async (id: string): Promise<boolean> => {
    return new Promise(res => {
      dispatch(deletedBhaai(id));
      res(true);
    });
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          <ScreenHeading
            title="Bhaai List"
            subtitle={`${data ? data.length : 0} entries`}
          />
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
                        color={stackBarStyles.iconColor.color}
                      />
                    </TouchableOpacity>
                  ),
                  trailing: (
                    <TouchableOpacity onPress={() => openItem(bhaaiItem)}>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={25}
                        color={stackBarStyles.iconColor.color}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteBhaai}
              refreshing={isLoading}
              refresh={refetch}
            />
          )}
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={0}
            spacing={0}>
            <IconButton
              onPress={() => {
                setOpenDailog('search');
              }}
              icon={props => (
                <Ionicons
                  name="search"
                  {...props}
                  color={stackBarStyles.iconColor.color}
                />
              )}
              color="secondary"
              style={stackBarStyles.fab}
            />
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
          title={selectedBhaai.marriage}
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
