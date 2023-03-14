import React, {useContext} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Bhaai from './bhaai';
import Profile from './profile';
import Nimta from './nimta';
import Relative from './relative';
import AppContext from '../services/storage';
import {AppContextState} from '../services/app.reducer';
import useStyles from '../styles/main';

const Tab = createBottomTabNavigator();

const Main: React.FC = () => {
  const myContext = useContext<AppContextState>(AppContext);
  const styles = useStyles(myContext.appSettings.theme);
  const screenoption = ({route}: any) => ({
    // eslint-disable-next-line react/no-unstable-nested-components
    tabBarIcon: ({
      focused,
      color,
      size,
    }: {
      focused: boolean;
      color: string;
      size: number;
    }) => {
      let iconName = 'ios-list';

      if (route.name === 'home') {
        iconName = focused ? 'home' : 'home-outline';
      }

      if (route.name === 'nimta') {
        iconName = focused ? 'mail-open' : 'mail-outline';
      }

      if (route.name === 'profile') {
        iconName = focused ? 'person-circle' : 'person-circle-outline';
      }

      if (route.name === 'relative') {
        iconName = focused ? 'people-circle' : 'people-circle-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarStyle: {
      backgroundColor: styles.tabBarStyle.backgroundColor,
    },
    tabBarActiveTintColor: styles.tabBarStyle.active,
    tabBarInactiveTintColor: styles.tabBarStyle.inactive,
    headerShown: false,
  });

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenoption}>
        <Tab.Screen name="home" component={Bhaai} />
        <Tab.Screen name="nimta" component={Nimta} />
        <Tab.Screen name="relative" component={Relative} />
        <Tab.Screen name="profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Main;
