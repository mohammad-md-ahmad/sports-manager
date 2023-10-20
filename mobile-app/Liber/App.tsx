/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AppLoader from './AppLoader';
import { AuthProvider } from './AuhtContext';
import { Provider } from 'react-redux';
import store from './store/store';


function App(): JSX.Element {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppLoader />
      </AuthProvider>
    </Provider>
  );
}

export default App;
