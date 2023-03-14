import React, {useContext, useState} from 'react';
import {Pressable, ScrollView, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {
  IconButton,
  ListItem,
  Stack,
  Text,
  TextInput,
} from '@react-native-material/core';

import useStyles from '../styles/baan';
import {Baan as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../components/ui/loader';
import {BaanBase} from '../types/BaanList';
import GiveBaan from '../components/giveBaan';
import AppContext from '../services/storage';
import useStackBarStyles from '../styles/stackBar';
import {Controller, useForm} from 'react-hook-form';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';

interface SearchProps {
  setSearchVisible: (visiblity: boolean) => any;
}

const Search: React.FC<SearchProps> = ({setSearchVisible}) => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  const stackBarStyles = useStackBarStyles(myContext.appSettings.theme);
  const [data, setData] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const [giveBaanVisible, setGiveBaanVisible] = useState(false);

  const [selectedBaan, setSelectedBaan] = useState({} as any);
  const {control, setFocus, register} = useForm<{
    searchText: string;
  }>({
    defaultValues: {
      searchText: '',
    },
  });

  const search = async (input: string) => {
    setLoading(true);
    const baanList = await apiService.searchBaan(input).catch(error => {
      if (error.type === 'NOT_AUTHENTICATED') {
        myContext.dispatch({type: APP_ACTIONS.LOGOUT});
      }

      return [];
    });
    setData({baanList});
    setLoading(false);
  };

  const openGiveBaan = (baan: BaanBase) => {
    setSelectedBaan(baan);
    setGiveBaanVisible(true);
  };

  const showMessage = (reason: string) => {
    if (reason === 'GIVEN') {
      myContext.dispatch({
        type: APP_ACTIONS.NEW_MESSAGE,
        payload: 'Baan has been given',
      });
    }
  };

  return (
    <>
      {!giveBaanVisible ? (
        <View style={styles.container}>
          {loading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          <Pressable onPress={() => setFocus('searchText')}>
            <Controller
              control={control}
              name="searchText"
              render={({field}) => (
                <TextInput
                  {...field}
                  {...register('searchText')}
                  variant="outlined"
                  label="Search"
                  autoFocus={true}
                  style={{margin: 16}}
                  onSubmitEditing={() => search(field.value)}
                  onChangeText={value => field.onChange(value)}
                  value={field.value}
                  trailing={props => (
                    <TouchableOpacity onPress={() => search(field.value)}>
                      <Ionicons
                        name="search"
                        {...props}
                        color={stackBarStyles.iconColor.color}
                      />
                    </TouchableOpacity>
                  )}
                />
              )}
            />
          </Pressable>
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
                  leadingMode="avatar"
                  leading={
                    <TouchableOpacity onPress={() => openGiveBaan(baan)}>
                      <Ionicons
                        color={stackBarStyles.iconColor.color}
                        style={{fontSize: 50}}
                        name="add"
                      />
                    </TouchableOpacity>
                  }
                />
              ))}
          </ScrollView>
          {data?.baanList?.length === 0 && (
            <Text style={styles.noItems}>no items available</Text>
          )}
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={0}
            spacing={0}>
            <IconButton
              onPress={() => {
                myContext.dispatch({type: APP_ACTIONS.REFETCH_BHAAI_LIST});
                setSearchVisible(false);
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
          </Stack>
        </View>
      ) : (
        <GiveBaan
          setVisible={setGiveBaanVisible}
          showMessage={showMessage}
          data={selectedBaan}
        />
      )}
    </>
  );
};

export default Search;
