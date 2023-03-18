import {Stack, Text} from '@react-native-material/core';
import React from 'react';
import {useAppSelector} from '../../redux/hooks';
import useStyles from '../../styles/screenHeading';

interface Props {
  title: string;
  subtitle?: string;
}

const ScreenHeading: React.FC<Props> = ({title, subtitle}) => {
  const theme = useAppSelector(state => state.theme.mode);
  const styles = useStyles(theme);
  return (
    <Stack m={4} spacing={4}>
      <Text style={styles.heading} variant="button">
        {title}
      </Text>
      {!!subtitle && (
        <Text style={styles.heading} variant="overline">
          {subtitle}
        </Text>
      )}
    </Stack>
  );
};

export default ScreenHeading;
