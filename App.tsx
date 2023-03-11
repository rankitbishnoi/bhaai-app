import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, View} from 'react-native';
import {Provider, defaultTheme} from '@react-native-material/core';

import useStyles from './src/styles/root';
import Auth from './src/screens/auth';
import AppContext from './src/services/storage';
import mmkv from './src/services/mmkv';
import Main from './src/screens/main';
import MessagePopUp from './src/components/messagePopUp';
import {QueryClient, QueryClientProvider} from 'react-query';

const App: React.FC = () => {
  const styles = useStyles();
  const [appSettings, setAppSettings] = useState({
    isLoggedIn: !!mmkv.loadJWT(),
    message: null,
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
            secondary: {
              main: 'rgb(0, 100, 100)',
              on: '#ddd',
            },
            background: {
              main: '#111',
              on: '#ddd',
            },
            surface: {
              main: '#111',
              on: '#ddd',
            },
          },
        }}>
        <AppContext.Provider value={{appSettings, setAppSettings}}>
          <View style={styles.root}>
            <SafeAreaView style={styles.safeAreaView}>
              {appSettings.isLoggedIn ? <Main /> : <Auth />}
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {appSettings?.message && (
                  <MessagePopUp
                    setVisible={() => {
                      setAppSettings({...appSettings, message: null});
                    }}
                    message={appSettings?.message}
                  />
                )}
              </KeyboardAvoidingView>
            </SafeAreaView>
          </View>
        </AppContext.Provider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
