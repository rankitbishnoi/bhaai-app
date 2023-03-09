import React, {useContext, useState} from 'react';
import {Animated, ListRenderItemInfo, View} from 'react-native';

import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import AppContext from '../../services/storage';
import HiddenItemWithActions from './hiddenItemWithActions';
import VisibleItem from './visibleItem';
import useStyles from '../../styles/swipeableList';

type RowMap<T> = {[open_cell_key: string]: SwipeRow<T>};

export interface SwipeableListItem {
  key: string;
  title: string;
  subtitle: string;
  leading?: React.ReactElement;
  trailing?: React.ReactElement;
  onPress?: () => any;
}

interface SwipeableListOptions {
  items: SwipeableListItem[];
  deleteItem: (id: string) => Promise<boolean>;
}

const SwipeableList: React.FC<SwipeableListOptions> = ({items, deleteItem}) => {
  const styles = useStyles();
  const myContext = useContext(AppContext);
  const [listData, setListData] = useState(items);
  const closeRow = (
    rowMap: RowMap<SwipeableListItem>,
    rowKey: keyof RowMap<SwipeableListItem>,
  ) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: RowMap<SwipeableListItem>, rowKey: string) => {
    deleteItem(rowKey).then(result => {
      if (result) {
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
        myContext.setAppSettings({
          ...myContext.appSettings,
          message: 'Item has been deleted',
        });
      } else {
        myContext.setAppSettings({
          ...myContext.appSettings,
          message: 'Unable to delete. Please try again',
        });
      }
      closeRow(rowMap, rowKey);
    });
  };

  const renderItem = (
    data: ListRenderItemInfo<SwipeableListItem>,
    rowMap: RowMap<SwipeableListItem>,
  ) => {
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <VisibleItem
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRow(rowMap, data.item.key)}
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
      />
    </View>
  );
};

export default SwipeableList;
