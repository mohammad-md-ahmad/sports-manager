/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AppLoader from './AppLoader';
import { AuthProvider } from './AuhtContext';
import { LoadingProvider } from './LoadingContext';


function App(): JSX.Element {
  return (
    <LoadingProvider>
      <AuthProvider>
        <AppLoader />
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
