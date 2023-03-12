import React, {useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, Stack, Text} from '@react-native-material/core';
import useStyles from '../styles/relative';
import {Relative as RelativeType} from '../types/Relative';
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
import SwipeableList from '../components/swipeableList/swipeableList';

const childPageStates = ['sort', 'filter', 'add', 'edit'];

interface RelativeProps {
  setVisible?: (visiblity: string) => any;
  relatives?: RelativeType[];
  nimtaId?: string;
  nimtaBase?: boolean;
}

const Relative: React.FC<RelativeProps> = ({
  nimtaId,
  nimtaBase,
  relatives,
  setVisible,
}) => {
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
  const relativeList = relatives || [];
  let {data, isLoading} = useQuery(
    ['relativeList', myContext.appSettings.selectedRole, filterBy, queryKey],
    () =>
      nimtaBase
        ? filterList(relativeList)
        : apiService.getRelativeList(
            myContext.appSettings.selectedRole,
            filterBy,
          ),
  );

  const filterList = (list: RelativeType[]) => {
    return list.filter(a => {
      let truthy = true;
      if (filterBy.firstName?.length) {
        truthy = truthy && a.firstName.includes(filterBy.firstName);
      }
      if (filterBy.lastName?.length) {
        truthy = truthy && a.lastName.includes(filterBy.lastName);
      }
      if (filterBy.address?.length) {
        truthy = truthy && a.address.includes(filterBy.address);
      }
      if (filterBy.fathersName?.length) {
        truthy = truthy && a.fathersName.includes(filterBy.fathersName);
      }
      if (filterBy.nickName?.length) {
        truthy = truthy && a.nickName.includes(filterBy.nickName);
      }
      if (filterBy.phoneNumber?.length) {
        truthy = truthy && a.phoneNumber.includes(filterBy.phoneNumber);
      }
      return truthy;
    });
  };

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

  const deleteRelative = async (id: string) => {
    if (nimtaBase && nimtaId) {
      return apiService
        .removeRelativeFromNimta(
          id,
          nimtaId,
          myContext.appSettings.selectedRole,
        )
        .then(() => {
          if (relatives) {
            const index = relatives?.findIndex(a => a._id === id);
            relatives.splice(index, 1);
          }
          return true;
        });
    }
    return apiService
      .deleteRelative(id, myContext.appSettings.selectedRole)
      .then(() => {
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
          <Stack m={4} spacing={4}>
            <Text style={styles.heading} variant="button">
              {nimtaBase ? 'Nimta Relatives' : 'Relatives'}
            </Text>
          </Stack>
          {!myContext.appSettings.selectedRole && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('profile' as never);
              }}>
              <View style={buttonStyles.button}>
                <Text style={buttonStyles.buttonTitle}>select pariwar</Text>
              </View>
            </TouchableOpacity>
          )}
          {myContext.appSettings.selectedRole && data && (
            <SwipeableList
              items={data.map(relative => {
                return {
                  key: relative._id,
                  title: `${relative.firstName} ${relative.lastName}${
                    relative.nickName ? '(' + relative.nickName + ')' : ''
                  } ${
                    relative.fathersName
                      ? 'S/O Shri ' + relative.fathersName
                      : ''
                  }, ${relative.address}`,
                  subtitle: `Mobile: ${
                    relative.phoneNumber || 'not available'
                  }`,
                  leading: (
                    <TouchableOpacity onPress={() => editItem(relative)}>
                      <Image
                        source={require('../assets/edit-icon.png')}
                        style={{width: 50, height: 50}}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteRelative}
              refreshing={isLoading}
              refresh={() => setQueryKey(Date.now())}
            />
          )}
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={1}
            right={1}
            spacing={0}>
            {!!nimtaBase && (
              <IconButton
                onPress={() => {
                  setVisible && setVisible('');
                }}
                icon={props => (
                  <Ionicons name="arrow-back-outline" {...props} />
                )}
                color="secondary"
                style={stackBarStyles.fab}
              />
            )}
            {!nimtaBase && <View style={stackBarStyles.fab} />}
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
            {!!nimtaBase && (
              <IconButton
                onPress={() => {
                  setVisible && setVisible('addFromRelative');
                }}
                icon={props => (
                  <Ionicons name="person-add-outline" {...props} />
                )}
                color="secondary"
                style={stackBarStyles.fab}
              />
            )}
            {!nimtaBase && (
              <IconButton
                onPress={() => {
                  setOpenDailog('add');
                }}
                icon={props => <Ionicons name="add" {...props} />}
                color="secondary"
                style={stackBarStyles.fab}
              />
            )}
          </Stack>
        </View>
      )}
      {openDailog === 'add' && (
        <AddRelative
          invalidateData={setQueryKey}
          setVisible={setOpenDailog}
          type="ADD"
          pariwarId={myContext.appSettings.selectedRole}
        />
      )}
      {openDailog === 'edit' && (
        <AddRelative
          invalidateData={setQueryKey}
          setVisible={setOpenDailog}
          type="EDIT"
          data={selectedRelative}
          pariwarId={myContext.appSettings.selectedRole}
        />
      )}
      {openDailog === 'sort' && (
        <SortRelative
          setVisible={setOpenDailog}
          sortBy={sortBy}
          setSortBy={sortList}
        />
      )}
      {openDailog === 'filter' && (
        <FilterRelative
          setVisible={setOpenDailog}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
      )}
    </>
  );
};

export default Relative;
