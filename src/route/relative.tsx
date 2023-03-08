import React, {useContext, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, ListItem, Stack} from '@react-native-material/core';

import useStyles from '../styles/relative';
import {Relative as RelativeType, RelativeBase} from '../types/Relative';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddRelative from '../components/addRelative';
import {Image} from 'react-native';
import ProgressBar from '../components/loader';
import AppContext from '../services/storage';
import {useQuery} from 'react-query';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import {useNavigation} from '@react-navigation/native';
import SortRelative from '../components/sortRelative';
import FilterRelative from '../components/filterRelative';

const Relative: React.FC = () => {
  const myContext = useContext(AppContext);
  const navigation = useNavigation();
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const buttonStyles = useButtonStyles();
  const [openDailog, setOpenDailog] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState({} as any);
  const [queryKey, setQueryKey] = useState(Date.now());
  const [selectedRelative, setSelectedRelative] = useState({} as any);
  let {data, isLoading} = useQuery(
    ['relativeList', myContext.appSettings.selectedRole, filterBy, queryKey],
    () =>
      apiService.getRelativeList(myContext.appSettings.selectedRole, filterBy),
  );

  const editItem = (relative: RelativeType) => {
    setSelectedRelative(relative);
    setOpenDailog('edit');
  };

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

  return (
    <>
      <View style={styles.container}>
        {isLoading && (
          <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
        )}
        <ScrollView>
          {!myContext.appSettings.selectedRole && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('profile');
              }}>
              <View style={buttonStyles.button}>
                <Text style={buttonStyles.buttonTitle}>select pariwar</Text>
              </View>
            </TouchableOpacity>
          )}
          {data?.map((relative: RelativeType) => (
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
                <TouchableOpacity onPress={() => editItem(relative)}>
                  <Image
                    source={require('../assets/edit-icon.png')}
                    style={{width: 50, height: 50}}
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
              setOpenDailog('search');
            }}
            icon={props => <Ionicons name="search" {...props} />}
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
              setOpenDailog('add');
            }}
            icon={props => <Ionicons name="add" {...props} />}
            color="secondary"
            style={stackBarStyles.fab}
          />
        </Stack>
        {openDailog === 'add' && (
          <AddRelative
            visible={openDailog}
            invalidateData={setQueryKey}
            setVisible={setOpenDailog}
            type="ADD"
            pariwarId={myContext.appSettings.selectedRole}
          />
        )}
        {openDailog === 'edit' && (
          <AddRelative
            visible={openDailog}
            invalidateData={setQueryKey}
            setVisible={setOpenDailog}
            type="EDIT"
            data={selectedRelative}
            pariwarId={myContext.appSettings.selectedRole}
          />
        )}
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

export default Relative;