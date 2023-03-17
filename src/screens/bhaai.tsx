import React, {useState} from 'react';
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
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  useGetBhaaiListQuery,
  deletedBhaai,
  bhaaiListApi,
  updatedBhaai,
} from '../redux/features/slices/bhaai-slice';
import {Model} from '../redux/features/helper';

const childPageStates = ['baan-list', 'search', 'edit', 'add'];

const Bhaai: React.FC = () => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);
  const stackBarStyles = useStackBarStyles(theme);
  const [selectedBhaai, setSelectedBhaai] = useState({} as any);
  const [openDailog, setOpenDailog] = useState('');
  const {bhaaiList: data = []} = useAppSelector(state => state);
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

  const deleteBhaai = (id: string) => {
    dispatch(deletedBhaai(id));
    dispatch(bhaaiListApi.endpoints.deleteBhaai.initiate(id));
    return true;
  };

  const sync = (item: Model<BhaaiType>) => {
    dispatch(updatedBhaai(item));
    dispatch(bhaaiListApi.endpoints.createBhaai.initiate(item));
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
                  notSynced: bhaaiItem.notSynced,
                  syncing: bhaaiItem.syncing,
                  sync: () => sync(bhaaiItem),
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
