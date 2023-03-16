import React from 'react';
import {View} from 'react-native';
import {useAppSelector} from '../../redux/hooks';
import useStyles from '../../styles/radioButton';

interface RadioButtonOptions {
  selected: boolean;
  styleInherited?: Record<string, unknown>;
}

const RadioButton: React.FC<RadioButtonOptions> = ({
  selected,
  styleInherited,
}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);

  return (
    <View style={[styles.container, styleInherited]}>
      {selected ? <View style={styles.selected} /> : null}
    </View>
  );
};

export default RadioButton;
