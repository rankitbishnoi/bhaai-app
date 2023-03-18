import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Stack} from '@react-native-material/core';
import useStyles from '../styles/task';
import {TaskInterface as TaskType} from '../types/event';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useButtonStyles from '../styles/button';
import useStackBarStyles from '../styles/stackBar';
import SwipeableList from '../components/swipeableList/swipeableList';
import ScreenHeading from '../components/ui/screenHeading';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {TaskInterface} from '../types/event';

const childPageStates = ['add', 'edit'];

interface TaskListProps {
  setVisible: (visiblity: boolean) => any;
  tasks: TaskInterface[];
  eventId: string;
  title: string;
}

const TaskList: React.FC<TaskListProps> = ({
  eventId,
  title,
  tasks: data,
  setVisible,
}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);
  const dispatch = useAppDispatch();
  const stackBarStyles = useStackBarStyles(theme);
  const buttonStyles = useButtonStyles(theme);
  const [openDailog, setOpenDailog] = useState('');
  const [selectedTask, setSelectedTask] = useState({} as any);

  const editItem = (task: TaskType) => {
    setSelectedTask(task);
    setOpenDailog('edit');
  };

  const deleteTask = (id: string) => {
    const index = data.findIndex(a => a._id === id);
    data.splice(index, 1);
    return true;
  };

  return (
    <>
      {!childPageStates.includes(openDailog) && (
        <View style={styles.container}>
          <ScreenHeading
            title={'Event Tasks'}
            subtitle={`${data ? data.length : 0} entries`}
          />
          {data && (
            <>
              <SwipeableList
                items={data.map(task => {
                  return {
                    key: task._id,
                    title: `${task.title}`,
                    subtitle: `statud: ${task.status}`,
                    leading: (
                      <TouchableOpacity onPress={() => editItem(task)}>
                        <Ionicons
                          name="create-outline"
                          size={25}
                          color={stackBarStyles.iconColor.color}
                        />
                      </TouchableOpacity>
                    ),
                  };
                })}
                deleteItem={deleteTask}
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
                    setVisible && setVisible(false);
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
                <IconButton
                  onPress={() => {
                    setOpenDailog('add');
                  }}
                  icon={props => (
                    <Ionicons
                      name="add-outline"
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
    </>
  );
};

export default TaskList;
