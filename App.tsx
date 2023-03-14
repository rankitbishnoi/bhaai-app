import React, {useReducer} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, View} from 'react-native';
import {Provider, defaultTheme} from '@react-native-material/core';

import useStyles from './src/styles/root';
import Auth from './src/screens/auth';
import AppContext from './src/services/storage';
import mmkv from './src/services/mmkv';
import Main from './src/screens/main';
import MessagePopUp from './src/components/ui/messagePopUp';
import {QueryClient, QueryClientProvider} from 'react-query';
import {appReducer} from './src/services/app.reducer';

const App: React.FC = () => {
  const styles = useStyles();
  const [appSettings, dispatch] = useReducer(appReducer, {
    isLoggedIn: !!mmkv.loadJWT(),
    messages: [],
    selectedPariwar: '',
    queryState: {
      baanList: Date.now(),
      bhaaiList: Date.now(),
      bhaaiTotal: Date.now(),
      nimtaList: Date.now(),
      relativeList: Date.now(),
      profile: Date.now(),
    },
  });
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider
        theme={{
          ...defaultTheme,
          colorScheme: 'dark',
          palette: {
            ...defaultTheme.palette,
            primary: {
              main: '#c9b79c',
              on: '#fff',
            },
            secondary: {
              main: '#101957',
              on: '#fff',
            },
            background: {
              main: '#fff',
              on: '#111',
            },
            surface: {
              main: '#fff',
              on: '#111',
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
