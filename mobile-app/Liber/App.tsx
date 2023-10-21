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
import { ToastProvider } from 'react-native-toast-notifications';


function App(): JSX.Element {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ToastProvider>
          <AppLoader />
        </ToastProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
