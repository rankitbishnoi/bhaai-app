import React, {useEffect, useState} from 'react';
import {Alert, Animated, ListRenderItemInfo, View} from 'react-native';

import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import HiddenItemWithActions from './hiddenItemWithActions';
import VisibleItem from './visibleItem';
import useStyles from '../../styles/swipeableList';
import {Text} from '@react-native-material/core';
import {RefreshControl} from 'react-native-gesture-handler';
import {createdMessages} from '../../redux/features/slices/message-slice';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';

type RowMap<T> = {[open_cell_key: string]: SwipeRow<T>};

export interface SwipeableListItem {
  key: string;
  title: string;
  subtitle: string;
  leading?: React.ReactElement;
  trailing?: React.ReactElement;
  notSynced?: boolean;
  syncing?: boolean;
  onPress?: () => any;
  sync?: () => void;
}

interface SwipeableListOptions {
  items: SwipeableListItem[];
  refresh: () => any;
  refreshing: boolean;
  deleteItem: (id: string) => boolean;
}

const SwipeableList: React.FC<SwipeableListOptions> = ({
  items,
  deleteItem,
  refresh,
  refreshing,
}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
  const styles = useStyles(theme);
  const [listData, setListData] = useState([
    ...items,
    {
      key: 'LAST_ITEM',
      title: 'LAST_ITEM',
      subtitle: 'LAST_ITEM',
    },
  ]);

  useEffect(() => {
    setListData([
      ...items,
      {
        key: 'LAST_ITEM',
        title: 'LAST_ITEM',
        subtitle: 'LAST_ITEM',
      },
    ]);
  }, [items]);
  const closeRow = (
    rowMap: RowMap<SwipeableListItem>,
    rowKey: keyof RowMap<SwipeableListItem>,
  ) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: RowMap<SwipeableListItem>, rowKey: string) => {
    Alert.alert('Are you sure?', 'you want to delete this item.', [
      {
        text: 'Cancel',
        onPress: () => closeRow(rowMap, rowKey),
        style: 'cancel',
      },
      {
        text: 'yes',
        onPress: () => {
          const result = deleteItem(rowKey);
          if (result) {
            const newData = [...listData];
            const prevIndex = listData.findIndex(item => item.key === rowKey);
            newData.splice(prevIndex, 1);
            setListData(newData);
            dispatch(createdMessages('Item has been deleted'));
          } else {
            dispatch(createdMessages('Unable to delete. Please try again'));
          }
          closeRow(rowMap, rowKey);
        },
      },
    ]);
  };

  const deleteRowAlert = (
    rowMap: RowMap<SwipeableListItem>,
    rowKey: string,
  ) => {
    const result = deleteItem(rowKey);
    if (result) {
      const newData = [...listData];
      const prevIndex = listData.findIndex(item => item.key === rowKey);
      newData.splice(prevIndex, 1);
      setListData(newData);
      dispatch(createdMessages('Item has been deleted'));
    } else {
      dispatch(createdMessages('Unable to delete. Please try again'));
    }
    closeRow(rowMap, rowKey);
  };

  const renderItem = (
    data: ListRenderItemInfo<SwipeableListItem>,
    rowMap: RowMap<SwipeableListItem>,
  ) => {
    const rowHeightAnimatedValue = new Animated.Value(40);

    return (
      <VisibleItem
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRowAlert(rowMap, data.item.key)}
      />
    );
  };

  const renderHiddenItem = (
    data: ListRenderItemInfo<SwipeableListItem>,
    rowMap: RowMap<SwipeableListItem>,
  ) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => closeRow(rowMap, data.item.key)}
        onDelete={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  const onRowDidOpen = () => {};

  const onLeftActionStatusChange = () => {};

  const onRightActionStatusChange = () => {};

  const onRightAction = () => {};

  const onLeftAction = () => {};

  return (
    <View style={styles.container}>
      {listData.length === 1 && (
        <Text style={styles.noItems}>no items available</Text>
      )}
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        disableRightSwipe
        onRowDidOpen={onRowDidOpen}
        leftActivationValue={100}
        rightActivationValue={-200}
        leftActionValue={0}
        rightActionValue={-500}
        onLeftAction={onLeftAction}
        onRightAction={onRightAction}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#fff"
            titleColor="#fff"
          />
        }
      />
    </View>
  );
};

export default SwipeableList;
