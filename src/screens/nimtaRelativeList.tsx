import React, {useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Stack, Text} from '@react-native-material/core';
import useStyles from '../styles/relative';
import {Relative1 as RelativeType} from '../types/Relative';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddRelative from '../components/addRelative';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import SortRelative from '../components/sortRelative';
import FilterRelative from '../components/filterRelative';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {callNumber} from '../services/callANumber';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {nimtaListApi} from '../redux/features/slices/nimta-slice';

const childPageStates = ['sort', 'filter'];

interface NimtaRelativeListProps {
  setVisible: (visiblity: string) => any;
  relatives: RelativeType[];
  nimtaId: string;
}

const NimtaRelativeList: React.FC<NimtaRelativeListProps> = ({
  nimtaId,
  relatives: data,
  setVisible,
}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const selectedPariwar =
    useAppSelector(state => state.profile.selectedPariwar) || '';
  const styles = useStyles(theme);
  const dispatch = useAppDispatch();
  const stackBarStyles = useStackBarStyles(theme);
  const buttonStyles = useButtonStyles(theme);
  const [openDailog, setOpenDailog] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState(null as any);
  const [selectedRelative, setSelectedRelative] = useState({} as any);

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

  const deleteRelative = (id: string) => {
    dispatch(
      nimtaListApi.endpoints.removeRelativeFromNimta.initiate({
        nimtaId,
        pariwarId: selectedPariwar,
        id,
      }),
    );
    const index = data.findIndex(a => a._id === id);
    data.splice(index, 1);
    return true;
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          <ScreenHeading
            title={'Nimta Relatives'}
            subtitle={`${filterList ? filterList.length : 0} entries`}
          />
          {data && (
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
                refreshing={false}
                refresh={() => {}}
              />
              <Stack
                style={stackBarStyles.stackBarBottom}
                fill
                bottom={0}
                spacing={0}>
                <IconButton
                  onPress={() => {
                    setVisible && setVisible('');
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
                    setVisible && setVisible('addFromRelative');
                  }}
                  icon={props => (
                    <Ionicons
                      name="person-add-outline"
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

export default NimtaRelativeList;
