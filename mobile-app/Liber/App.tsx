/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Image,
  StatusBar,
  useColorScheme,
  View,
  ScrollView,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './src/login/login';
import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './src/dashboard/dashboard';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import styles from './styles/styles';
import Content from './src/drawer/content';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  //const Stack = createNativeStackNavigator();

  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <Drawer.Navigator
        drawerContent={(props) => <Content {...props} />}
        initialRouteName="Dashboard">
        <Drawer.Group>
          <Drawer.Screen name="Dashboard" options={{ title: 'Dashboard' }} component={Dashboard} />
          <Drawer.Screen name="LoginScreen" options={{ title: 'Login Screen' }} component={LoginScreen} />

        </Drawer.Group>

        <Drawer.Group>
          <Drawer.Screen name="About" options={{ title: 'About' }} component={Dashboard} />
        </Drawer.Group>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;