/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
    StatusBar,
    Text,
    useColorScheme,
} from 'react-native';

import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './src/login/login';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from './src/dashboard/dashboard';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import Content from './src/drawer/content';
import colors from './styles/colors';
import About from './src/about/about';
import { useAuth } from './AuhtContext';

function AppLoader(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };

    const Drawer = createDrawerNavigator();
    const { isAuthenticated } = useAuth();

    return (
        <NavigationContainer>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            {isAuthenticated ?
                <Drawer.Navigator
                    drawerContent={(props) => <Content {...props} />}
                    initialRouteName="Dashboard">
                    <Drawer.Group
                        screenOptions={{ headerStyle: { backgroundColor: colors.PrimaryGreen } }}>

                        <Drawer.Screen name="Dashboard" options={{ title: 'Dashboard' }} component={Dashboard} />

                        <Drawer.Group
                        // screenOptions={({ navigation }) => ({
                        //   presentation: 'modal',
                        //   headerLeft: () => <CancelButton onPress={navigation.goBack} />,
                        // })}
                        >
                            <Drawer.Screen name="About" options={{ title: 'About' }} component={About} />
                        </Drawer.Group>
                    </Drawer.Group>
                </Drawer.Navigator> :
                <LoginScreen />}
        </NavigationContainer>
    );
}

export default AppLoader;
