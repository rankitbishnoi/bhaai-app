import React, {useContext, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {
  Divider,
  IconButton,
  Stack,
  Switch,
  Text,
} from '@react-native-material/core';
import useStyles from '../styles/nimta';
import useStackBarStyles from '../styles/stackBar';
import {Nimta as NimtaType} from '../types/Nimta';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddNimta from '../components/addNimta';
import ProgressBar from '../components/loader';
import AppContext from '../services/storage';
import {useQuery} from 'react-query';
import useButtonStyles from '../styles/button';
import {useNavigation} from '@react-navigation/native';
import Relative from './relative';
import AddFromRelative from '../components/addFromRelative';
import AddFromBaan from '../components/addFromBaan';
import SwipeableList from '../components/swipeableList/swipeableList';
import {AppContextState} from '../services/app.reducer';
import ScreenHeading from '../components/screenHeading';

const childPageStates = [
  'relative',
  'addFromRelative',
  'addFromBaan',
  'add',
  'edit',
];

const Nimta: React.FC = () => {
  const myContext = useContext<AppContextState>(AppContext);
  const navigation = useNavigation();
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const buttonStyles = useButtonStyles();
  const [openDailog, setOpenDailog] = useState('');
  const [selectedNimta, setSelectedNimta] = useState({} as any);
  const [queryKey, setQueryKey] = useState(Date.now());
  const {data, isLoading} = useQuery(
    ['nimtaList', myContext.appSettings.selectedPariwar, queryKey],
    () => apiService.getNimtaList(myContext.appSettings.selectedPariwar),
  );

  const editItem = (nimta: NimtaType) => {
    setSelectedNimta(nimta);
    setOpenDailog('edit');
  };

  const deleteNimta = async (id: string) => {
    return apiService
      .deleteNimta(id, myContext.appSettings.selectedPariwar)
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
          <ScreenHeading title="Nimta List" />
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
              items={data.map(nimta => {
                return {
                  title: nimta.name,
                  key: nimta._id,
                  subtitle: `Relatives: ${nimta.relative.length}`,
                  onPress: () => {
                    setSelectedNimta(nimta);
                    setOpenDailog('relative');
                  },
                  leading: (
                    <TouchableOpacity onPress={() => editItem(nimta)}>
                      <Ionicons
                        name="create-outline"
                        size={25}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  ),
                  trailing: (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedNimta(nimta);
                        setOpenDailog('relative');
                      }}>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={25}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteNimta}
              refreshing={isLoading}
              refresh={() => setQueryKey(Date.now())}
            />
          )}
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={1}
            right={1}
            spacing={4}>
            <View />
            <IconButton
              onPress={() => {
                setOpenDailog('add');
              }}
              icon={props => <Ionicons name="add" {...props} />}
              color="secondary"
              style={stackBarStyles.fab}
            />
          </Stack>
        </View>
      )}
      {openDailog === 'add' && (
        <AddNimta
          setVisible={value => setOpenDailog(value ? 'add' : '')}
          type="ADD"
          pariwarId={myContext.appSettings.selectedPariwar}
          invalidateData={setQueryKey}
        />
      )}
      {openDailog === 'edit' && (
        <AddNimta
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
          data={selectedNimta}
          pariwarId={myContext.appSettings.selectedPariwar}
          invalidateData={setQueryKey}
        />
      )}
      {openDailog === 'relative' && (
        <Relative
          relatives={selectedNimta.relative}
          nimtaBase={true}
          nimtaId={selectedNimta._id}
          setVisible={value => setOpenDailog(value)}
        />
      )}
      {(openDailog === 'addFromRelative' || openDailog === 'addFromBaan') && (
        <View style={stackBarStyles.background}>
          <Stack style={stackBarStyles.stackBar} m={0} spacing={0}>
            <Pressable onPress={() => setOpenDailog('addFromBaan')}>
              <Text style={stackBarStyles.stackBarHeadings} variant="button">
                Baan
              </Text>
            </Pressable>
            <Switch
              thumbColor={'#eee'}
              trackColor={{true: 'rgb(93, 95, 222)', false: '#666'}}
              value={openDailog === 'addFromRelative'}
              onValueChange={() =>
                setOpenDailog(
                  openDailog === 'addFromBaan'
                    ? 'addFromRelative'
                    : 'addFromBaan',
                )
              }
            />
            <Pressable onPress={() => setOpenDailog('addFromRelative')}>
              <Text style={stackBarStyles.stackBarHeadings} variant="button">
                Relative
              </Text>
            </Pressable>
          </Stack>
          <Divider
            style={stackBarStyles.divider}
            leadingInset={16}
            trailingInset={16}
            color={'#333'}
          />
        </View>
      )}
      {openDailog === 'addFromRelative' && (
        <AddFromRelative
          nimtaId={selectedNimta._id}
          invalidateData={setQueryKey}
          setVisible={value => setOpenDailog(value)}
        />
      )}
      {openDailog === 'addFromBaan' && (
        <AddFromBaan
          nimtaId={selectedNimta._id}
          invalidateData={value => {
            setQueryKey(value);
          }}
          setVisible={value => setOpenDailog(value)}
        />
      )}
    </>
  );
};

export default Nimta;
