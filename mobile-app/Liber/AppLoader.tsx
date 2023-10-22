
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

import MiscService from './api/MiscService';
import { useAuth } from './AuhtContext';
import { getUserData } from './helpers/userDataManage';
import { storeFacilityTypes } from './helpers/facilityTypesDataManage';
import { storeCountries } from './helpers/countriesDataManage';
import LoginScreen from './src/login/login';
import Signup from './src/login/signup';
import DrawerContent from './src/drawer/drawerContent';
import AppNavigator from './src/drawer/appNavigator';


function AppLoader(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };

    const Drawer = createDrawerNavigator();
    const Stack = createStackNavigator();

    const { isAuthenticated } = useAuth();

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
        });
    }, []);

    return (
        <NavigationContainer>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            {isAuthenticated ?
                <Drawer.Navigator
                    drawerContent={(props) => <DrawerContent {...props} />}
                    initialRouteName="AppNavigator"
                >
                    <Drawer.Group
                        screenOptions={{
                            headerShown: false
                        }}>

                        <Drawer.Screen name="AppNavigator" component={AppNavigator} />

                    </Drawer.Group>
                </Drawer.Navigator> :

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
