import React, {useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Stack, Text} from '@react-native-material/core';
import useStyles from '../styles/relative';
import {RelativeBase, Relative as RelativeType} from '../types/Relative';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddRelative from '../components/addRelative';
import ProgressBar from '../components/ui/loader';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import {useNavigation} from '@react-navigation/native';
import SortRelative from '../components/sortRelative';
import FilterRelative from '../components/filterRelative';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {callNumber} from '../services/callANumber';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  deletedRelative,
  relativeListApi,
  updatedRelative,
  useGetRelativeListQuery,
} from '../redux/features/slices/relative-slice';
import {Model} from '../redux/features/helper';

const childPageStates = ['sort', 'filter', 'add', 'edit'];

interface RelativeProps {}

const Relative: React.FC<RelativeProps> = ({}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const selectedPariwar =
    useAppSelector(state => state.profile.selectedPariwar) || '';
  const navigation = useNavigation();
  const styles = useStyles(theme);
  const stackBarStyles = useStackBarStyles(theme);
  const buttonStyles = useButtonStyles(theme);
  const [openDailog, setOpenDailog] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState(null as any);
  const [selectedRelative, setSelectedRelative] = useState({} as any);
  const dispatch = useAppDispatch();
  const {isLoading, refetch} = useGetRelativeListQuery(selectedPariwar);
  const data = useAppSelector(state => state.relativeList);

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

  const sortList = (by: keyof RelativeBase = 'firstName') => {
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

  const deleteRelative = (id: string) => {
    dispatch(deletedRelative({pariwarId: selectedPariwar, id}));
    dispatch(
      relativeListApi.endpoints.deleteRelative.initiate({
        pariwarId: selectedPariwar,
        id,
      }),
    );
    return true;
  };

  const sync = (item: Model<RelativeType>) => {
    const newBaanPayload = {
      pariwarId: selectedPariwar,
      body: item,
    };
    dispatch(updatedRelative(newBaanPayload));
    dispatch(relativeListApi.endpoints.createRelative.initiate(newBaanPayload));
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          <ScreenHeading
            title={'Relatives'}
            subtitle={`${filterList ? filterList.length : 0} entries`}
          />
          {selectedPariwar.length === 0 && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('profile' as never);
              }}>
              <View style={buttonStyles.button}>
                <Text style={buttonStyles.buttonTitle}>select pariwar</Text>
              </View>
            </TouchableOpacity>
          )}
          {selectedPariwar.length !== 0 && data && (
            <>
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
                    notSynced: relative.notSynced,
                    syncing: relative.syncing,
                    sync: () => sync(relative),
                    leading: (
                      <TouchableOpacity onPress={() => editItem(relative)}>
                        <Ionicons
                          name="create-outline"
                          size={25}
                          color={stackBarStyles.iconColor.color}
                        />
                      </TouchableOpacity>
                    ),
                    trailing: relative.phoneNumber ? (
                      <TouchableOpacity
                        onPress={() => callNumber(relative.phoneNumber)}>
                        <Ionicons
                          name="call-outline"
                          size={25}
                          color={stackBarStyles.iconColor.color}
                        />
                      </TouchableOpacity>
                    ) : undefined,
                  };
                })}
                deleteItem={deleteRelative}
                refreshing={isLoading}
                refresh={refetch}
              />
              <Stack
                style={stackBarStyles.stackBarBottom}
                fill
                bottom={0}
                spacing={0}>
                <View style={stackBarStyles.fab} />
                <View
                  style={{...buttonStyles.buttonGroup, ...styles.sortFilter}}>
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
            </>
          )}
        </View>
      )}
      {openDailog === 'add' && (
        <AddRelative
          setVisible={setOpenDailog}
          type="ADD"
          pariwarId={selectedPariwar}
        />
      )}
      {openDailog === 'edit' && (
        <AddRelative
          setVisible={setOpenDailog}
          type="EDIT"
          data={selectedRelative}
          pariwarId={selectedPariwar}
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
