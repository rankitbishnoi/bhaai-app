import React, {useReducer} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, View} from 'react-native';
import {Provider, defaultTheme} from '@react-native-material/core';

import useStyles from './src/styles/root';
import {styles as themeStyles} from './src/styles/theme';
import Auth from './src/screens/auth';
import AppContext from './src/services/storage';
import mmkv from './src/services/mmkv';
import Main from './src/screens/main';
import MessagePopUp from './src/components/ui/messagePopUp';
import {QueryClient, QueryClientProvider} from 'react-query';
import {appReducer, themeColor} from './src/services/app.reducer';
import {Appearance} from 'react-native';

const App: React.FC = () => {
  const [appSettings, dispatch] = useReducer(appReducer, {
    isLoggedIn: !!mmkv.loadJWT(),
    messages: [],
    selectedPariwar: null,
    queryState: {
      baanList: Date.now(),
      bhaaiList: Date.now(),
      bhaaiTotal: Date.now(),
      nimtaList: Date.now(),
      relativeList: Date.now(),
      profile: Date.now(),
    },
    theme: (Appearance.getColorScheme() || themeColor.LIGHT) as themeColor,
  });
  const styles = useStyles(appSettings.theme);
  const theme = themeStyles[appSettings.theme === 'dark' ? 'dark' : 'light'];
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider
        theme={{
          ...defaultTheme,
          colorScheme: appSettings.theme,
          palette: {
            ...defaultTheme.palette,
            primary: {
              main: theme.secondary,
              on: theme.frontColorInvert,
            },
            secondary: {
              main: theme.primary,
              on: theme.frontColorInvert,
            },
            background: {
              main: theme.backgroundScreen,
              on: theme.frontColorInvert,
            },
            surface: {
              main: theme.backgroundSecondary,
              on: theme.frontColor,
            },
          },
        }}>
        <AppContext.Provider value={{appSettings, dispatch}}>
          <View style={styles.root}>
            <SafeAreaView style={styles.safeAreaView}>
              {appSettings.isLoggedIn ? <Main /> : <Auth />}
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <MessagePopUp />
              </KeyboardAvoidingView>
            </SafeAreaView>
          </View>
        </AppContext.Provider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
