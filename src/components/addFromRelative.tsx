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
import SizedBox from './SizedBox';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';

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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const selectAll = () => {
    data && setSelectedRelatives(data.map(a => a._id));
  };

  const deselectAll = () => {
    setSelectedRelatives([]);
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
    <MenuProvider>
      <View style={styles.container}>
        {isLoading && (
          <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
        )}
        <Stack m={4} spacing={4} style={stackBarStyles.stackBar}>
          <View style={stackBarStyles.empty} />
          <Text style={styles.heading} variant="button">
            Relative List
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
          {data?.map(relative => (
            <ListItem
              key={relative._id}
              title={`${relative.firstName} ${relative.lastName}${
                relative.nickName ? '(' + relative.nickName + ')' : ''
              } ${
                relative.fathersName ? 'S/O Shri ' + relative.fathersName : ''
              }, ${relative.address}`}
              secondaryText={`Mobile: ${
                relative.phoneNumber || 'not available'
              }`}
              style={styles.list}
              elevation={4}
              leadingMode="icon"
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
              addRelative();
            }}
            icon={props => <Ionicons name="add" {...props} />}
            color="secondary"
            style={stackBarStyles.fab}
          />
        </Stack>
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
      </View>
    </MenuProvider>
  );
};

export default AddFromRelative;
