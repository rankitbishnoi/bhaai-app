import React, {useContext, useEffect, useState} from 'react';
import {Pressable, ScrollView, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {
  IconButton,
  ListItem,
  Stack,
  TextInput,
} from '@react-native-material/core';

import useStyles from '../styles/baan';
import {Baan as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../components/loader';
import {BaanBase} from '../types/BaanList';
import GiveBaan from '../components/giveBaan';
import AppContext from '../services/storage';
import useStackBarStyles from '../styles/stackBar';
import {Controller, useForm} from 'react-hook-form';

interface SearchProps {
  setSearchVisible: (visiblity: boolean) => any;
  invalidateData: (reason: number) => any;
}

const Search: React.FC<SearchProps> = ({setSearchVisible, invalidateData}) => {
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
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
  useEffect(() => {
    setFocus('searchText');
  }, [setFocus]);
  const search = async (input: string) => {
    setLoading(true);
    const baanList = await apiService.searchBaan(input);
    setData({baanList});
    setLoading(false);
  };

  const openGiveBaan = (baan: BaanBase) => {
    setSelectedBaan(baan);
    setGiveBaanVisible(true);
  };

  const showMessage = (reason: string) => {
    if (reason === 'GIVEN') {
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Baan has been given',
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
                  style={{margin: 16}}
                  onSubmitEditing={() => search(field.value)}
                  onChangeText={value => field.onChange(value)}
                  value={field.value}
                  trailing={props => (
                    <TouchableOpacity onPress={() => search(field.value)}>
                      <Ionicons name="search" {...props} />
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
                        color={'white'}
                        style={{fontSize: 50}}
                        name="add"
                      />
                    </TouchableOpacity>
                  }
                />
              ))}
          </ScrollView>
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={1}
            right={1}
            spacing={4}>
            <IconButton
              onPress={() => {
                invalidateData(Date.now());
                setSearchVisible(false);
              }}
              icon={props => <Ionicons name="arrow-back-outline" {...props} />}
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
