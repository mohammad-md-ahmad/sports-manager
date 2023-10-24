
import React, { useEffect, useState } from 'react';
import {
    StatusBar,
    useColorScheme,
} from 'react-native';

import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from './AuhtContext';
import { getUserData } from './helpers/userDataManage';

import LoginScreen from './src/login/login';
import Signup from './src/login/signup';
import DrawerContent from './src/drawer/drawerContent';
import AppNavigator from './src/drawer/appNavigator';
import TabNavigator from './src/drawer/tabNavigator';
import colors from './styles/colors';
import DrawerNavigator from './src/drawer/drawerNavigator';


function AppLoader(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };

    const Drawer = createDrawerNavigator();
    const Stack = createStackNavigator();

    const { isAuthenticated } = useAuth();


    return (
        <NavigationContainer>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            {isAuthenticated ?
                <DrawerNavigator /> :

                <Stack.Navigator
                    initialRouteName="Login"
                >
                    <Stack.Screen name="Login" options={{ title: 'Login' }} component={LoginScreen} />
                    <Stack.Screen name="Signup" options={{ title: 'Signup' }} component={Signup} />
                </Stack.Navigator>
            }
        </NavigationContainer>
    );
}

export default AppLoader;
