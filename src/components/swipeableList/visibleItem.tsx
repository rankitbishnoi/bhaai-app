import {ListItem, Stack} from '@react-native-material/core';
import React from 'react';
import {
  Animated,
  TouchableHighlight,
  ListRenderItemInfo,
  View,
  Pressable,
} from 'react-native';
import {useAppSelector} from '../../redux/hooks';
import useStyles from '../../styles/swipeableList';
import SizedBox from '../ui/sizedBox';
import {LoadingSpinner} from '../ui/syncIcon';
import {SwipeableListItem} from './swipeableList';

interface VisibleItemOptions {
  data: ListRenderItemInfo<SwipeableListItem>;
  rowHeightAnimatedValue: Animated.Value;
  removeRow: () => any;
  rightActionState?: boolean;
}

const VisibleItem: React.FC<VisibleItemOptions> = ({
  data,
  rowHeightAnimatedValue,
  removeRow,
  rightActionState,
}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);

  if (rightActionState) {
    Animated.timing(rowHeightAnimatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      removeRow();
    });
  }

  const onPress = () => data.item.onPress && data.item.onPress();

  return (
    <>
      {data.item.key !== 'LAST_ITEM' ? (
        <Animated.View style={[styles.rowFront]}>
          <TouchableHighlight
            style={styles.rowFrontVisible}
            underlayColor={'#ccc'}>
            <ListItem
              onPress={() => onPress()}
              key={data.item.key}
              title={data.item.title}
              secondaryText={data.item.subtitle}
              style={styles.list}
              elevation={4}
              leadingMode="icon"
              leading={data.item.leading}
              trailing={
                <Stack style={styles.trailing}>
                  {data.item.notSynced === true ? (
                    <Pressable onPress={data.item.sync}>
                      <LoadingSpinner
                        rotate={data.item.syncing === true}
                        size={24}
                        color={styles.iconColor.color}
                      />
                    </Pressable>
                  ) : (
                    <View style={styles.noIconColor} />
                  )}
                  {data.item.trailing}
                </Stack>
              }
            />
          </TouchableHighlight>
        </Animated.View>
      ) : (
        <SizedBox height={60} />
      )}
    </>
  );
};

export default VisibleItem;
