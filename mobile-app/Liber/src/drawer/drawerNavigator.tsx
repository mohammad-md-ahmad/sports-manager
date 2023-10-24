// StackNavigator.tsx
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CompanyProfile from '../company/companyProfile';
import CompanyProfileForm from '../company/companyProfileForm';
import Dashboard from '../dashboard/dashboard';
import AgendaScreen from '../calendar/calendar';
import About from '../about/about';
import UserProfile from '../user/userProfile';
import UserProfileForm from '../user/userProfileForm';
import Facilities from '../facilities/facilities';
import FacilityForm from '../facilities/facilityForm';
import colors from '../../styles/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './drawerContent';
import TabNavigator from './tabNavigator';
import AppNavigator from './appNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

    const navigator = useNavigation();

    const [drawerIndex, setDrawerIndex] = useState(0);

    useEffect(() => {
        const index = 0;//navigator.getState().routes[0].state?.index;
        setDrawerIndex(index ?? 0);
    }, [])

    const toggleBack = () => {
        navigator.goBack();
    }

    const toggleSearch = () => {

    }

    return (
        <Drawer.Navigator

            drawerContent={(props) => <DrawerContent {...props} />}
            initialRouteName="AppNavigator"
        >
            <Drawer.Group
                screenOptions={{
                    headerStyle: { backgroundColor: colors.PrimaryGreen },
                    headerRight: () =>
                        <>

                            <View style={{ margin: 15 }}>
                                <Icon
                                    name="arrow-back" // Replace with your desired icon name
                                    type="material"
                                    size={25}
                                    onPress={() => toggleBack()}
                                />
                            </View>

                        </>
                }}
            >

                <Drawer.Screen name="TabNavigator" component={TabNavigator} />
                <Drawer.Screen name="AppNavigator" component={AppNavigator} />

            </Drawer.Group>
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;







