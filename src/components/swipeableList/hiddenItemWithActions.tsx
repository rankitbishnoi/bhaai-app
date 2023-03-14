import React, {useContext} from 'react';
import {
  Animated,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RowMap} from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContextState} from '../../services/app.reducer';
import AppContext from '../../services/storage';
import useStyles from '../../styles/swipeableList';
import {SwipeableListItem} from './swipeableList';

interface HiddenItemWithActionsOptions {
  data: ListRenderItemInfo<SwipeableListItem>;
  rowMap: RowMap<SwipeableListItem>;
  swipeAnimatedValue?: Animated.Value;
  leftActionActivated?: boolean;
  rightActionActivated?: boolean;
  rowActionAnimatedValue: Animated.Value;
  rowHeightAnimatedValue?: Animated.Value;
  onClose: () => any;
  onDelete: () => any;
}

const HiddenItemWithActions: React.FC<HiddenItemWithActionsOptions> = ({
  data,
  swipeAnimatedValue,
  leftActionActivated,
  rightActionActivated,
  rowActionAnimatedValue,
  onClose,
  onDelete,
}) => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  if (rightActionActivated) {
    Animated.spring(rowActionAnimatedValue, {
      toValue: 500,
      useNativeDriver: false,
    }).start();
  } else {
    Animated.spring(rowActionAnimatedValue, {
      toValue: 75,
      useNativeDriver: false,
    }).start();
  }

  return (
    <>
      {data.item.key !== 'LAST_ITEM' ? (
        <Animated.View style={[styles.rowBack]}>
          <Text>Left</Text>
          {!leftActionActivated && (
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnLeft]}
              onPress={onClose}>
              <Ionicons
                name="close-circle-outline"
                size={25}
                style={styles.trash}
                color="#fff"
              />
            </TouchableOpacity>
          )}
          {!leftActionActivated && (
            <Animated.View
              style={[
                styles.backRightBtn,
                styles.backRightBtnRight,
                {
                  flex: 1,
                  width: rowActionAnimatedValue,
                },
              ]}>
              <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={onDelete}>
                <Animated.View
                  style={[
                    styles.trash,
                    {
                      transform: [
                        {
                          scale: swipeAnimatedValue
                            ? swipeAnimatedValue.interpolate({
                                inputRange: [-90, -45],
                                outputRange: [1, 0],
                                extrapolate: 'clamp',
                              })
                            : 1,
                        },
                      ],
                    },
                  ]}>
                  <Ionicons name="trash-outline" size={25} color="#fff" />
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      ) : (
        <View />
      )}
    </>
  );
};

export default HiddenItemWithActions;
