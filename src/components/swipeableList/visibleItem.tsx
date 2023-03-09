import {ListItem} from '@react-native-material/core';
import React from 'react';
import {
  Animated,
  TouchableHighlight,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import useStyles from '../../styles/swipeableList';
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
  const styles = useStyles();

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
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.rowFront]}>
        <TouchableHighlight
          style={styles.rowFrontVisible}
          underlayColor={'#ccc'}>
          <ListItem
            key={data.item.key}
            title={data.item.title}
            secondaryText={data.item.subtitle}
            style={styles.list}
            elevation={4}
            leadingMode="image"
            leading={data.item.leading}
            trailing={data.item.trailing}
          />
        </TouchableHighlight>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default VisibleItem;
