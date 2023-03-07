import React from 'react';

import useStyles from '../styles/main';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Bhaai from './bhaai';
import Profile from './profile';

const Tab = createBottomTabNavigator();

const Main: React.FC = () => {
  const styles = useStyles();

  const screenoption = ({route}: any) => ({
    // eslint-disable-next-line react/no-unstable-nested-components
    tabBarIcon: ({focused, color, size}) => {
      let iconName = 'ios-list';

      if (route.name === 'Home') {
        iconName = focused
          ? 'ios-information-circle'
          : 'ios-information-circle-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarStyle: {
      backgroundColor: 'black',
    },
    tabBarActiveTintColor: 'rgb(93, 95, 222)',
    tabBarInactiveTintColor: 'white',
    headerStyle: {
      backgroundColor: 'black',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  });

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenoption}>
        <Tab.Screen name="Home" component={Bhaai} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Main;
