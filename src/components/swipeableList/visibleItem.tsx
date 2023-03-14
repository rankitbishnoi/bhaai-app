import {ListItem} from '@react-native-material/core';
import React, {useContext} from 'react';
import {Animated, TouchableHighlight, ListRenderItemInfo} from 'react-native';
import {AppContextState} from '../../services/app.reducer';
import AppContext from '../../services/storage';
import useStyles from '../../styles/swipeableList';
import SizedBox from '../ui/sizedBox';
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
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);

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
              trailing={data.item.trailing}
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
