import * as React from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppSelector} from '../../redux/hooks';
import {styles} from '../../styles/theme';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
export const LoadingSpinner = React.memo(
  ({color = null, size = 25, rotate = false}: Props) => {
    const theme = useAppSelector(state => state.theme.mode);
    const themeStyles = styles[theme === 'dark' ? 'dark' : 'light'];
    const fadeInValue = useSharedValue(0);
    const spinValue = useSharedValue(0);

    fadeInValue.value = withTiming(1, {
      duration: 1000,
      easing: Easing.linear,
    });

    console.log(rotate);

    if (rotate) {
      spinValue.value = withRepeat(
        withTiming(72000, {
          duration: 150000,
          easing: Easing.linear,
        }),
        -1,
      );
    } else {
      spinValue.value = 0;
    }

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{rotateZ: spinValue.value + 'deg'}],
        opacity: fadeInValue.value,
        lineHeight: size,
      };
    });

    return (
      <AnimatedIcon
        name="sync-circle-outline"
        size={size}
        style={animatedStyles}
        color={color || themeStyles.primary}
      />
    );
  },
);

type Props = {
  color?: string | null;
  size?: number;
  rotate?: boolean;
};
