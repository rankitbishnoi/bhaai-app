import React, {useContext, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {IconButton, Stack, Text} from '@react-native-material/core';
import useStyles from '../styles/relative';
import {Relative as RelativeType} from '../types/Relative';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddRelative from '../components/addRelative';
import ProgressBar from '../components/ui/loader';
import AppContext from '../services/storage';
import {useQuery} from 'react-query';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import {useNavigation} from '@react-navigation/native';
import SortRelative from '../components/sortRelative';
import FilterRelative from '../components/filterRelative';
import SwipeableList from '../components/swipeableList/swipeableList';
import {AppContextState, APP_ACTIONS} from '../services/app.reducer';
import ScreenHeading from '../components/ui/screenHeading';

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
  const myContext = useContext<AppContextState>(AppContext);
  const navigation = useNavigation();
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const buttonStyles = useButtonStyles();
  const [openDailog, setOpenDailog] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState(null as any);
  const [selectedRelative, setSelectedRelative] = useState({} as any);
  const relativeList = relatives || [];
  let {data, isLoading} = useQuery(
    [
      'relativeList',
      myContext.appSettings.selectedPariwar,
      myContext.appSettings.queryState.relativeList,
    ],
    () =>
      nimtaBase
        ? relativeList
        : apiService
            .getRelativeList(myContext.appSettings.selectedPariwar)
            .catch(error => {
              if (error.type === 'NOT_AUTHENTICATED') {
                myContext.dispatch({type: APP_ACTIONS.LOGOUT});
              }

              return [];
            }),
  );

  const filterList = useMemo(() => {
    if (!filterBy) {
      return data ? data : [];
    }

    return data
      ? data.filter(a => {
          let truthy = true;
          if (filterBy.firstName?.length) {
            truthy =
              truthy &&
              a.firstName
                .toLowerCase()
                .includes(filterBy.firstName?.toLowerCase());
          }
          if (filterBy.lastName?.length) {
            truthy =
              truthy &&
              a.lastName
                .toLowerCase()
                .includes(filterBy.lastName?.toLowerCase());
          }
          if (filterBy.address?.length) {
            truthy =
              truthy &&
              a.address.toLowerCase().includes(filterBy.address?.toLowerCase());
          }
          if (filterBy.fathersName?.length) {
            truthy =
              truthy &&
              a.fathersName
                .toLowerCase()
                .includes(filterBy.fathersName?.toLowerCase());
          }
          if (filterBy.nickName?.length) {
            truthy =
              truthy &&
              a.nickName
                .toLowerCase()
                .includes(filterBy.nickName?.toLowerCase());
          }
          if (filterBy.phoneNumber?.length) {
            truthy =
              truthy &&
              a.phoneNumber
                .toLowerCase()
                .includes(filterBy.phoneNumber?.toLowerCase());
          }
          return truthy;
        })
      : [];
  }, [data, filterBy]);

  const editItem = (relative: RelativeType) => {
    setSelectedRelative(relative);
    setOpenDailog('edit');
  };

  const sortList = (by: keyof RelativeType = 'firstName') => {
    filterList?.sort((a, b) => {
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
          myContext.appSettings.selectedPariwar,
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
      .deleteRelative(id, myContext.appSettings.selectedPariwar)
      .then(() => {
        if (data) {
          const index = data?.findIndex(a => a._id === id);
          data.splice(index, 1);
        }
        return true;
      });
  };

  const refresh = () => {
    myContext.dispatch({type: APP_ACTIONS.REFETCH_RELATIVE_LIST});
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          <ScreenHeading title={nimtaBase ? 'Nimta Relatives' : 'Relatives'} />
          {!myContext.appSettings.selectedPariwar && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('profile' as never);
              }}>
              <View style={buttonStyles.button}>
                <Text style={buttonStyles.buttonTitle}>select pariwar</Text>
              </View>
            </TouchableOpacity>
          )}
          {myContext.appSettings.selectedPariwar && data && (
            <SwipeableList
              items={filterList.map(relative => {
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
                      <Ionicons
                        name="create-outline"
                        size={25}
                        color={'#101957'}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteRelative}
              refreshing={isLoading}
              refresh={refresh}
            />
          )}
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={0}
            spacing={0}>
            {!!nimtaBase && (
              <IconButton
                onPress={() => {
                  setVisible && setVisible('');
                }}
                icon={props => (
                  <Ionicons
                    name="arrow-back-outline"
                    {...props}
                    color={'#101957'}
                  />
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
                  <Ionicons
                    name="person-add-outline"
                    {...props}
                    color={'#101957'}
                  />
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
                icon={props => (
                  <Ionicons name="add" {...props} color={'#101957'} />
                )}
                color="secondary"
                style={stackBarStyles.fab}
              />
            )}
          </Stack>
        </View>
      )}
      {openDailog === 'add' && (
        <AddRelative
          setVisible={setOpenDailog}
          type="ADD"
          pariwarId={myContext.appSettings.selectedPariwar}
        />
      )}
      {openDailog === 'edit' && (
        <AddRelative
          setVisible={setOpenDailog}
          type="EDIT"
          data={selectedRelative}
          pariwarId={myContext.appSettings.selectedPariwar}
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
