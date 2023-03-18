import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Stack} from '@react-native-material/core';
import useStyles from '../styles/event';
import useStackBarStyles from '../styles/stackBar';
import {EventInterface} from '../types/event';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Search from './search';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {deletedEvent} from '../redux/features/slices/event-slice';
import TaskList from './tasks';
import AddEvent from '../components/addEvent';

const childPageStates = ['baan-list', 'search', 'edit', 'add'];

const Event: React.FC = () => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);
  const stackBarStyles = useStackBarStyles(theme);
  const [selectedEvent, setSelectedEvent] = useState({} as EventInterface);
  const [openDailog, setOpenDailog] = useState('');
  const {eventList: data = []} = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  const editItem = (event: EventInterface) => {
    setSelectedEvent(event);
    setOpenDailog('edit');
  };

  const openItem = (event: EventInterface) => {
    setSelectedEvent(event);
    setOpenDailog('baan-list');
  };

  const deleteEvent = (id: string) => {
    dispatch(deletedEvent(id));
    return true;
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          <ScreenHeading
            title="Event List"
            subtitle={`${data ? data.length : 0} entries`}
          />
          {data && (
            <SwipeableList
              items={data.map(eventItem => {
                return {
                  title: eventItem.name,
                  key: eventItem._id,
                  onPress: () => openItem(eventItem),
                  subtitle: `Tasks: ${eventItem.tasks.length}`,
                  leading: (
                    <TouchableOpacity onPress={() => editItem(eventItem)}>
                      <Ionicons
                        name="create-outline"
                        size={25}
                        color={stackBarStyles.iconColor.color}
                      />
                    </TouchableOpacity>
                  ),
                  trailing: (
                    <TouchableOpacity onPress={() => openItem(eventItem)}>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={25}
                        color={stackBarStyles.iconColor.color}
                      />
                    </TouchableOpacity>
                  ),
                };
              })}
              deleteItem={deleteEvent}
              refreshing={false}
              refresh={() => {}}
            />
          )}
          <Stack
            style={stackBarStyles.stackBarBottom}
            fill
            bottom={0}
            spacing={0}>
            <View style={stackBarStyles.fab} />
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
        <AddEvent
          setVisible={value => setOpenDailog(value ? 'add' : '')}
          type="ADD"
        />
      )}
      {openDailog === 'edit' && (
        <AddEvent
          setVisible={value => setOpenDailog(value ? 'edit' : '')}
          type="EDIT"
          data={selectedEvent}
        />
      )}
      {openDailog === 'baan-list' && (
        <TaskList
          eventId={selectedEvent._id}
          title={selectedEvent.name}
          tasks={selectedEvent.tasks}
          setVisible={value => setOpenDailog(value ? 'task-list' : '')}
        />
      )}
      {openDailog === 'search' && (
        <Search
          setSearchVisible={value => setOpenDailog(value ? 'search' : '')}
        />
      )}
    </>
  );
};

export default Event;
