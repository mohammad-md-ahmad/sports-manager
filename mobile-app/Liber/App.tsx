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
import { LogLevel, OneSignal } from 'react-native-onesignal';
import Constants from './helpers/constants';


function App(): JSX.Element {

  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize(Constants.oneSignalAppID);

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', (event) => {
    console.log('OneSignal: notification clicked:', event);
  });

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
