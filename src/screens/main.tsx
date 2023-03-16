import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Bhaai from './bhaai';
import Profile from './profile';
import Nimta from './nimta';
import Relative from './relative';
import useStyles from '../styles/main';
import {useAppSelector} from '../redux/hooks';
import Auth from './auth';
import {defaultTheme, Provider} from '@react-native-material/core';
import {styles as themeModes} from '../styles/theme';
import {KeyboardAvoidingView, Platform, SafeAreaView, View} from 'react-native';
import MessagePopUp from '../components/ui/messagePopUp';

const Tab = createBottomTabNavigator();

const Main: React.FC = () => {
  const isLoggedIn = useAppSelector(state => state.profile.isLoggedIn);
  const theme = useAppSelector(state => state.theme.mode);
  const themeStyles = themeModes[theme === 'dark' ? 'dark' : 'light'];
  const styles = useStyles(theme);
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
    <Provider
      theme={{
        ...defaultTheme,
        colorScheme: theme,
        palette: {
          ...defaultTheme.palette,
          primary: {
            main: themeStyles.secondary,
            on: themeStyles.frontColorInvert,
          },
          secondary: {
            main: themeStyles.primary,
            on: themeStyles.frontColorInvert,
          },
          background: {
            main: themeStyles.backgroundScreen,
            on: themeStyles.frontColorInvert,
          },
          surface: {
            main: themeStyles.backgroundSecondary,
            on: themeStyles.frontColor,
          },
        },
      }}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          {isLoggedIn ? (
            <NavigationContainer>
              <Tab.Navigator screenOptions={screenoption}>
                <Tab.Screen name="home" component={Bhaai} />
                <Tab.Screen name="nimta" component={Nimta} />
                <Tab.Screen name="relative" component={Relative} />
                <Tab.Screen name="profile" component={Profile} />
              </Tab.Navigator>
            </NavigationContainer>
          ) : (
            <Auth />
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <MessagePopUp />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Provider>
  );
};

export default Main;
