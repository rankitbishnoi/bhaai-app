import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Stack} from '@react-native-material/core';

import useStyles from '../styles/baan';
import useStackBarStyles from '../styles/stackBar';
import {Baan as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddBaan from '../components/addBaan';
import ProgressBar from '../components/ui/loader';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  baanListApi,
  deletedBaan,
  updatedBaan,
  useGetBaanListQuery,
} from '../redux/features/slices/baan-slice';
import {Model} from '../redux/features/helper';

const childPageStates = ['edit', 'add'];

interface BaanProps {
  setBaanVisible: (visiblity: boolean) => any;
  bhaaiId: string;
  title: string;
}

const Baan: React.FC<BaanProps> = ({bhaaiId, setBaanVisible, title}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);
  const stackBarStyles = useStackBarStyles(theme);
  const [openDailog, setOpenDailog] = useState('');
  const [selectedBaan, setSelectedBaan] = useState({} as any);
  const {isLoading, refetch} = useGetBaanListQuery();
  const data = useAppSelector(state => state.baanList);
  const baanList = data[bhaaiId] || [];
  const baanListTotal = baanList.reduce(
    (pre: number, cur: BaanType) => pre + cur.amount,
    0,
  );
  const dispatch = useAppDispatch();

  const editItem = (baan: BaanType) => {
    setSelectedBaan(baan);
    setOpenDailog('edit');
  };

  const deleteBaan = (id: string) => {
    dispatch(deletedBaan({bhaaiId, id}));
    dispatch(
      baanListApi.endpoints.deleteBaan.initiate({
        bhaaiId,
        id,
      }),
    );
    return true;
  };

  const sync = (item: Model<BaanType>) => {
    const newBaanPayload = {
      bhaaiId,
      body: item,
    };
    dispatch(updatedBaan(newBaanPayload));
    dispatch(baanListApi.endpoints.createBaan.initiate(newBaanPayload));
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          {data && (
            <ScreenHeading
              title={title}
              subtitle={`Rs: ${baanListTotal}, ${baanList.length} entries`}
            />
          )}
          {data && (
            <SwipeableList
              items={baanList.map(baan => {
                return {
                  title: `${baan.firstName} ${baan.lastName}${
                    baan.nickName ? '(' + baan.nickName + ')' : ''
                  } ${
                    baan.fathersName ? 'S/O Shri ' + baan.fathersName : ''
                  }, ${baan.address}`,
                  key: baan._id,
                  subtitle: `Rs: ${baan.amount}`,
                  notSynced: baan.notSynced,
                  syncing: baan.syncing,
                  sync: () => sync(baan),
                  leading: (
                    <TouchableOpacity onPress={() => editItem(baan)}>
                      <Ionicons
                        name="create-outline"
                        size={25}
                        color={stackBarStyles.iconColor.color}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteBaan}
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
                setBaanVisible(false);
              }}
              icon={props => (
                <Ionicons
                  name="arrow-back-outline"
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
        <AddBaan
          setVisible={value => setOpenDailog(value ? 'add' : '')}
          type="ADD"
          bhaaiId={bhaaiId}
        />
      )}
      {openDailog === 'edit' && (
        <AddBaan
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
          bhaaiId={bhaaiId}
          data={selectedBaan}
        />
      )}
    </>
  );
};

export default Baan;
