import React, {useContext, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
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
import ProgressBar from './loader';
import AppContext from '../services/storage';
import {useQuery} from 'react-query';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import SortBaan from './sortRelative';
import FilterBaan from './filterBaan';
import RadioButton from './radioButton';
import SizedBox from './SizedBox';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';

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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const selectAll = () => {
    data && setSelectedBaans(data.map(a => a._id));
  };

  const deselectAll = () => {
    setSelectedBaans([]);
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
    <MenuProvider>
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
                color={'white'}
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
                  backgroundColor: '#444',
                  borderRadius: 5,
                },
                optionWrapper: {
                  padding: 10,
                },
                optionTouchable: {
                  activeOpacity: 70,
                },
                optionText: {
                  color: '#ccc',
                },
              }}>
              <MenuOption onSelect={selectAll} text="select all" />
              <Divider color={'#333'} />
              <MenuOption onSelect={deselectAll} text="deselect all" />
            </MenuOptions>
          </Menu>
        </Stack>
        <ScrollView>
          {data?.map(baan => (
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
      </View>
    </MenuProvider>
  );
};

export default AddFromBaan;
