import React, {useContext} from 'react';
import {View} from 'react-native';
import {AppContextState} from '../../services/app.reducer';
import AppContext from '../../services/storage';
import useStyles from '../../styles/radioButton';

interface RadioButtonOptions {
  selected: boolean;
  styleInherited?: Record<string, unknown>;
}

const RadioButton: React.FC<RadioButtonOptions> = ({
  selected,
  styleInherited,
}) => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);

  return (
    <View style={[styles.container, styleInherited]}>
      {selected ? <View style={styles.selected} /> : null}
    </View>
  );
};

export default RadioButton;
