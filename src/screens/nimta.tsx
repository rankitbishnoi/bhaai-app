import React, {useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
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
import ProgressBar from '../components/ui/loader';
import useButtonStyles from '../styles/button';
import {useNavigation} from '@react-navigation/native';
import AddFromRelative from '../components/addFromRelative';
import AddFromBaan from '../components/addFromBaan';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import NimtaRelativeList from './nimtaRelativeList';
import {
  deletedNimta,
  nimtaListApi,
  updatedNimta,
  useGetNimtaListQuery,
} from '../redux/features/slices/nimta-slice';
import {Model} from '../redux/features/helper';

const childPageStates = [
  'relative',
  'addFromRelative',
  'addFromBaan',
  'add',
  'edit',
];

const Nimta: React.FC = () => {
  const theme = useAppSelector(state => state.theme.mode);
  const selectedPariwar =
    useAppSelector(state => state.profile.selectedPariwar) || '';
  const navigation = useNavigation();
  const styles = useStyles(theme);
  const stackBarStyles = useStackBarStyles(theme);
  const buttonStyles = useButtonStyles(theme);
  const [openDailog, setOpenDailog] = useState('');
  const [selectedNimta, setSelectedNimta] = useState({} as any);
  const dispatch = useAppDispatch();
  const {isLoading, refetch} = useGetNimtaListQuery(selectedPariwar);
  const data = useAppSelector(state => state.nimtaList);

  const editItem = (nimta: NimtaType) => {
    setSelectedNimta(nimta);
    setOpenDailog('edit');
  };

  const deleteNimta = (id: string) => {
    dispatch(deletedNimta({pariwarId: selectedPariwar, id}));
    dispatch(
      nimtaListApi.endpoints.deleteNimta.initiate({
        pariwarId: selectedPariwar,
        id,
      }),
    );
    return true;
  };

  const sync = (item: Model<NimtaType>) => {
    const newBaanPayload = {
      pariwarId: selectedPariwar,
      body: item,
    };
    dispatch(updatedNimta(newBaanPayload));
    dispatch(nimtaListApi.endpoints.createNimta.initiate(newBaanPayload));
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          {isLoading && (
            <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
          )}
          <ScreenHeading
            title="Nimta List"
            subtitle={`${data ? data.length : 0} entries`}
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
            <SwipeableList
              items={data.map(nimta => {
                return {
                  title: nimta.name,
                  key: nimta._id,
                  subtitle: `Relatives: ${nimta.relative.length}`,
                  notSynced: nimta.notSynced,
                  syncing: nimta.syncing,
                  sync: () => sync(nimta),
                  onPress: () => {
                    setSelectedNimta(nimta);
                    setOpenDailog('relative');
                  },
                  leading: (
                    <TouchableOpacity onPress={() => editItem(nimta)}>
                      <Ionicons
                        name="create-outline"
                        size={25}
                        color={stackBarStyles.iconColor.color}
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
                        color={stackBarStyles.iconColor.color}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteNimta}
              refreshing={isLoading}
              refresh={refetch}
            />
          )}
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={0}
            spacing={0}>
            <View />
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
        </View>
      )}
      {openDailog === 'add' && (
        <AddNimta
          setVisible={value => setOpenDailog(value ? 'add' : '')}
          type="ADD"
          pariwarId={selectedPariwar}
        />
      )}
      {openDailog === 'edit' && (
        <AddNimta
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
          data={selectedNimta}
          pariwarId={selectedPariwar}
        />
      )}
      {openDailog === 'relative' && (
        <NimtaRelativeList
          relatives={selectedNimta.relative}
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
              thumbColor={stackBarStyles.toggleColor.thumb}
              trackColor={{
                true: stackBarStyles.toggleColor.active,
                false: stackBarStyles.toggleColor.inactive,
              }}
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
          setVisible={value => setOpenDailog(value)}
        />
      )}
      {openDailog === 'addFromBaan' && (
        <AddFromBaan
          nimtaId={selectedNimta._id}
          setVisible={value => setOpenDailog(value)}
        />
      )}
    </>
  );
};

export default Nimta;
