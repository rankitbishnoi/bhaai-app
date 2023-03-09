import React, {useContext, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, ListItem, Stack} from '@react-native-material/core';

import useStyles from '../styles/baan';
import {BaanBase as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from './loader';
import AppContext from '../services/storage';
import {useQuery} from 'react-query';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import SortBaan from './sortRelative';
import FilterBaan from './filterBaan';
import RadioButton from './radioButton';

interface BaanProps {
  setVisible: (visiblity: string) => any;
  invalidateData: (key: number) => any;
  nimtaId: string;
}

const AddFromBaan: React.FC<BaanProps> = ({
  setVisible,
  nimtaId,
  invalidateData,
}) => {
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const buttonStyles = useButtonStyles();
  const [openDailog, setOpenDailog] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedBaan, setSelectedBaans] = useState([] as string[]);
  const [filterBy, setFilterBy] = useState({} as any);
  let {data, isLoading} = useQuery(
    ['baanList', myContext.appSettings.selectedRole, filterBy],
    () => apiService.getBaanList(filterBy),
  );

  const sortList = (by: keyof BaanType = 'firstName') => {
    data?.sort((a, b) => {
      if (a[by] < b[by]) {
        return -1;
      }
      if (a[by] > b[by]) {
        return 1;
      }
      return 0;
    });

    setSortBy(by);
  };

  const toggleSelect = (id: string) => {
    if (selectedBaan.includes(id)) {
      setSelectedBaans(selectedBaan.filter(a => a !== id));
    } else {
      setSelectedBaans([...selectedBaan, id]);
    }
  };

  const addBaan = () => {
    const addBaanData = {
      baanIds: selectedBaan,
      relativeIds: [],
    };
    apiService
      .addRelativesInNimta(
        nimtaId,
        myContext.appSettings.selectedRole,
        addBaanData,
      )
      .then(() => {
        invalidateData(Date.now());
        setVisible('');
      });
  };

  return (
    <>
      <View style={styles.container}>
        {isLoading && (
          <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
        )}
        <ScrollView>
          {data?.map(baan => (
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
                <TouchableOpacity
                  onPress={() => {
                    toggleSelect(baan._id);
                  }}>
                  <RadioButton selected={selectedBaan.includes(baan._id)} />
                </TouchableOpacity>
              }
              trailing={props => (
                <Ionicons name="chevron-forward-outline" {...props} />
              )}
            />
          ))}
        </ScrollView>
        <Stack
          style={stackBarStyles.stackBar}
          fill
          bottom={1}
          right={1}
          spacing={0}>
          <IconButton
            onPress={() => {
              setVisible('');
            }}
            icon={props => <Ionicons name="arrow-back-outline" {...props} />}
            color="secondary"
            style={stackBarStyles.fab}
          />
          <View style={{...buttonStyles.buttonGroup, ...styles.sortFilter}}>
            <TouchableOpacity
              onPress={() => {
                setOpenDailog('sort');
              }}>
              <View
                style={{
                  ...buttonStyles.buttonGroupItem,
                  ...buttonStyles.buttonSmall,
                }}>
                <Ionicons
                  style={buttonStyles.buttonGroupItemIcon}
                  name="funnel-outline"
                />
                <Text style={buttonStyles.buttonGroupTitle}>sort</Text>
              </View>
            </TouchableOpacity>
            <View style={buttonStyles.buttonGroupDivider} />
            <TouchableOpacity
              onPress={() => {
                setOpenDailog('filter');
              }}>
              <View
                style={{
                  ...buttonStyles.buttonGroupItem,
                  ...buttonStyles.buttonSmall,
                }}>
                <Ionicons
                  style={buttonStyles.buttonGroupItemIcon}
                  name="filter-outline"
                />
                <Text style={buttonStyles.buttonGroupTitle}>filter</Text>
              </View>
            </TouchableOpacity>
          </View>
          <IconButton
            onPress={() => {
              addBaan();
            }}
            icon={props => <Ionicons name="add" {...props} />}
            color="secondary"
            style={stackBarStyles.fab}
          />
        </Stack>
        {openDailog === 'sort' && (
          <SortBaan
            visible={openDailog}
            setVisible={setOpenDailog}
            sortBy={sortBy}
            setSortBy={sortList}
          />
        )}
        {openDailog === 'filter' && (
          <FilterBaan
            visible={openDailog}
            setVisible={setOpenDailog}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
        )}
      </View>
    </>
  );
};

export default AddFromBaan;
