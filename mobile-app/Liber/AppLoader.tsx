
import React, { useEffect, useState } from 'react';
import {
    StatusBar,
    useColorScheme,
} from 'react-native';

import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from './AuhtContext';
import LoginScreen from './src/login/login';
import Signup from './src/login/signup';
import FooterBar from './src/navigators/footerBar';
import AppNavigator from './src/navigators/appNavigator';


function AppLoader(): JSX.Element {
    const { isAuthenticated } = useAuth();

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };

    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            {isAuthenticated ?
                <>
                    <AppNavigator />
                    <FooterBar />
                </>
                :

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
