import React, {useReducer} from 'react';

import AppContext from './src/services/storage';
import {QueryClient, QueryClientProvider} from 'react-query';
import {appReducer} from './src/services/app.reducer';
import {Provider as ReduxProvider} from 'react-redux';
import {store, persistor} from './src/redux/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import Main from './src/screens/main';

const App: React.FC = () => {
  const [appSettings, dispatch] = useReducer(appReducer, {
    selectedPariwar: null,
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
      <AppContext.Provider value={{appSettings, dispatch}}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Main />
          </PersistGate>
        </ReduxProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
