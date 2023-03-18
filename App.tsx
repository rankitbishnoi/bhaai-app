import React from 'react';

import {Provider as ReduxProvider} from 'react-redux';
import {store, persistor} from './src/redux/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import Main from './src/screens/main';

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Main />
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
