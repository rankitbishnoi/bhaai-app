import React, {useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, Stack} from '@react-native-material/core';

import useStyles from '../styles/baan';
import useStackBarStyles from '../styles/stackBar';
import {Baan as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddBaan from '../components/addBaan';
import ProgressBar from '../components/ui/loader';
import {useQuery} from 'react-query';
import {BaanList} from '../types/BaanList';
import {BhaaiTotal} from '../types/BhaaiTotal';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';
import AppContext from '../services/storage';

const childPageStates = ['edit', 'add'];

interface BaanProps {
  setBaanVisible: (visiblity: boolean) => any;
  bhaaiId: string;
}

const Baan: React.FC<BaanProps> = ({bhaaiId, setBaanVisible}) => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  const stackBarStyles = useStackBarStyles(myContext.appSettings.theme);
  const [openDailog, setOpenDailog] = useState('');
  const [selectedBaan, setSelectedBaan] = useState({} as any);
  const {data, isLoading} = useQuery(
    ['baanList', bhaaiId, myContext.appSettings.queryState.baanList],
    () =>
      Promise.all([
        apiService.getBaanList(bhaaiId).catch(error => {
          if (error.type === 'NOT_AUTHENTICATED') {
            myContext.dispatch({type: APP_ACTIONS.LOGOUT});
          }

          return [];
        }),
        apiService.getBhaai(bhaaiId, true).catch(error => {
          if (error.type === 'NOT_AUTHENTICATED') {
            myContext.dispatch({type: APP_ACTIONS.LOGOUT});
          }

          return {} as BhaaiTotal;
        }),
      ]).then(([baanList, bhaaiData]: [BaanList, BhaaiTotal]) => ({
        baanList,
        bhaaiData,
      })),
  );

  const editItem = (baan: BaanType) => {
    setSelectedBaan(baan);
    setOpenDailog('edit');
  };

  const refresh = () => {
    myContext.dispatch({type: APP_ACTIONS.REFETCH_BAAN_LIST});
  };

  const deleteBaan = async (id: string) => {
    return apiService
      .deleteBaan(id, bhaaiId)
      .catch(error => {
        if (error.type === 'NOT_AUTHENTICATED') {
          myContext.dispatch({type: APP_ACTIONS.LOGOUT});
        }

        return null;
      })
      .then(() => {
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
            <ScreenHeading
              title={data.bhaaiData.marriage}
              subtitle={`Rs: ${data.bhaaiData.total}`}
            />
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
                        color={stackBarStyles.iconColor.color}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteBaan}
              refreshing={isLoading}
              refresh={refresh}
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
