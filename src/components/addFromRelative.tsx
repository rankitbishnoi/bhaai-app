import React, {useContext, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, ListItem, Stack} from '@react-native-material/core';

import useStyles from '../styles/relative';
import {Relative as RelativeType} from '../types/Relative';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from './loader';
import AppContext from '../services/storage';
import {useQuery} from 'react-query';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import SortRelative from './sortRelative';
import FilterRelative from './filterRelative';
import RadioButton from './radioButton';

interface RelativeProps {
  setVisible: (visiblity: string) => any;
  invalidateData: (key: number) => any;
  nimtaId: string;
}

const AddFromRelative: React.FC<RelativeProps> = ({
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
  const [selectedRelative, setSelectedRelatives] = useState([] as string[]);
  const [filterBy, setFilterBy] = useState({} as any);
  let {data, isLoading} = useQuery(
    ['relativeList', myContext.appSettings.selectedRole, filterBy],
    () =>
      apiService.getRelativeList(myContext.appSettings.selectedRole, filterBy),
  );

  const sortList = (by: keyof RelativeType = 'firstName') => {
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
    if (selectedRelative.includes(id)) {
      setSelectedRelatives(selectedRelative.filter(a => a !== id));
    } else {
      setSelectedRelatives([...selectedRelative, id]);
    }
  };

  const addRelative = () => {
    const addRelativeData = {
      relativeIds: selectedRelative,
      baanIds: [],
    };
    apiService
      .addRelativesInNimta(
        nimtaId,
        myContext.appSettings.selectedRole,
        addRelativeData,
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
          {data?.map(relative => (
            <ListItem
              key={relative._id}
              title={`${relative.firstName} ${relative.lastName}${
                relative.nickName ? '(' + relative.nickName + ')' : ''
              } ${relative.fathersName ? 'S/O ' + relative.fathersName : ''}, ${
                relative.address
              }`}
              secondaryText={`Mobile: ${relative.phoneNumber}`}
              style={styles.list}
              elevation={4}
              leadingMode="image"
              leading={
                <TouchableOpacity
                  onPress={() => {
                    toggleSelect(relative._id);
                  }}>
                  <RadioButton
                    selected={selectedRelative.includes(relative._id)}
                  />
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
              addRelative();
            }}
            icon={props => <Ionicons name="add" {...props} />}
            color="secondary"
            style={stackBarStyles.fab}
          />
        </Stack>
        {openDailog === 'sort' && (
          <SortRelative
            visible={openDailog}
            setVisible={setOpenDailog}
            sortBy={sortBy}
            setSortBy={sortList}
          />
        )}
        {openDailog === 'filter' && (
          <FilterRelative
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

export default AddFromRelative;
