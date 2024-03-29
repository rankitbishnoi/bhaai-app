import React, {useMemo, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {
  Divider,
  IconButton,
  ListItem,
  Stack,
  Text,
} from '@react-native-material/core';

import useStyles from '../styles/baan';
import {BaanBase as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from './ui/loader';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import SortBaan from './sortRelative';
import FilterBaan from './filterBaan';
import RadioButton from './ui/radioButton';
import SizedBox from './ui/sizedBox';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {useGetBaanListQuery} from '../redux/features/slices/baan-slice';
import {nimtaListApi} from '../redux/features/slices/nimta-slice';

const childPageStates = ['sort', 'filter'];

interface BaanProps {
  setVisible: (visiblity: string) => any;
  nimtaId: string;
}

const AddFromBaan: React.FC<BaanProps> = ({setVisible, nimtaId}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const selectedPariwar =
    useAppSelector(state => state.profile.selectedPariwar) || '';
  const styles = useStyles(theme);
  const stackBarStyles = useStackBarStyles(theme);
  const buttonStyles = useButtonStyles(theme);
  const [openDailog, setOpenDailog] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBaan, setSelectedBaans] = useState([] as string[]);
  const [filterBy, setFilterBy] = useState(null as any);
  const {isLoading} = useGetBaanListQuery();
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.baanList);
  const baanList = Object.values(data).flat();

  const filterList = useMemo(() => {
    if (!filterBy) {
      return baanList ? baanList : [];
    }

    return baanList
      ? baanList.filter(a => {
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
          if (filterBy.amount) {
            truthy = truthy && a.amount === filterBy.amount;
          }
          return truthy;
        })
      : [];
  }, [baanList, filterBy]);

  const sortList = (by: keyof BaanType = 'firstName') => {
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

  const toggleSelect = (id: string) => {
    if (selectedBaan.includes(id)) {
      setSelectedBaans(selectedBaan.filter(a => a !== id));
    } else {
      setSelectedBaans([...selectedBaan, id]);
    }
  };

  const selectAll = () => {
    baanList && setSelectedBaans(baanList.map(a => a._id));
  };

  const deselectAll = () => {
    setSelectedBaans([]);
  };

  const addBaan = () => {
    const addBaanData = {
      baanIds: selectedBaan,
      relativeIds: [],
    };
    dispatch(
      nimtaListApi.endpoints.addBaanAndRelativeInNimta.initiate({
        id: nimtaId,
        pariwarId: selectedPariwar,
        body: addBaanData,
      }),
    );
    setVisible('');
  };

  return (
    <MenuProvider>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          <Stack m={4} spacing={4} style={stackBarStyles.stackBar}>
            <View style={stackBarStyles.empty} />
            <Text style={styles.heading} variant="button">
              Baan List
            </Text>
            <Menu
              style={stackBarStyles.empty}
              onClose={() => {
                setMenuOpen(false);
              }}
              onOpen={() => {
                setMenuOpen(true);
              }}>
              <MenuTrigger>
                <Ionicons
                  style={stackBarStyles.left}
                  size={24}
                  color={stackBarStyles.iconColor.color}
                  name={
                    menuOpen
                      ? 'ellipsis-horizontal'
                      : 'ellipsis-horizontal-outline'
                  }
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    backgroundColor: stackBarStyles.popUp.back,
                    borderRadius: 5,
                  },
                  optionWrapper: {
                    padding: 10,
                  },
                  optionTouchable: {
                    activeOpacity: 70,
                  },
                  optionText: {
                    color: stackBarStyles.popUp.front,
                  },
                }}>
                <MenuOption onSelect={selectAll} text="select all" />
                <Divider color={'#333'} />
                <MenuOption onSelect={deselectAll} text="deselect all" />
              </MenuOptions>
            </Menu>
          </Stack>
          <ScrollView>
            {filterList.map(baan => (
              <ListItem
                onPress={() => {
                  toggleSelect(baan._id);
                }}
                key={baan._id}
                title={`${baan.firstName} ${baan.lastName}${
                  baan.nickName ? '(' + baan.nickName + ')' : ''
                } ${baan.fathersName ? 'S/O Shri ' + baan.fathersName : ''}, ${
                  baan.address
                }`}
                secondaryText={`Rs: ${baan.amount}`}
                style={styles.list}
                elevation={4}
                leadingMode="icon"
                leading={
                  <RadioButton selected={selectedBaan.includes(baan._id)} />
                }
              />
            ))}
            <SizedBox height={60} />
          </ScrollView>
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={0}
            spacing={0}>
            <IconButton
              onPress={() => {
                setVisible('');
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
      {openDailog === 'sort' && (
        <SortBaan
          setVisible={setOpenDailog}
          sortBy={sortBy}
          setSortBy={sortList}
        />
      )}
      {openDailog === 'filter' && (
        <FilterBaan
          setVisible={setOpenDailog}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
      )}
    </MenuProvider>
  );
};

export default AddFromBaan;
