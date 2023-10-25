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
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import { Screens } from '../../helpers/constants';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const AppNavigator = () => {

    const navigator = useNavigation();
    const currentScreen = useSelector(state => state.currentScreen);

    const toggleDrawer = () => {
        navigator.toggleDrawer();
    }

    useEffect(() => {
        const index = navigator.getState().routes[0].state?.index;

        console.log(navigator.getState());
    }, [navigator.getState().routes[0].state?.index])

    const toggleBack = () => {
        console.log(navigator.getState());
        navigator.goBack();
    }

    const toggleSearch = () => {

    }

    return (
        <Stack.Navigator>
            <Stack.Group
                screenOptions={{
                    //headerShown:false,
                    headerStyle: { backgroundColor: colors.PrimaryGreen },
                    headerLeft: () =>
                        <>
                            {currentScreen == Screens.Dashboard ?
                                <View style={{ margin: 15 }}>
                                    <Icon
                                        name="menu" // Replace with your desired icon name
                                        type="material"
                                        size={25}
                                        onPress={() => toggleDrawer()}
                                    />
                                </View>
                                :
                                <View style={{ margin: 15 }}>
                                    <Icon
                                        name="arrow-back" // Replace with your desired icon name
                                        type="material"
                                        size={25}
                                        onPress={() => toggleBack()}
                                    />
                                </View>
                            }
                        </>
                    ,
                    headerRight: () =>
                        <>

                            <View style={{ margin: 15 }}>
                                <Icon
                                    name="search" // Replace with your desired icon name
                                    type="material"
                                    size={25}
                                    onPress={() => toggleSearch()}
                                />
                            </View>

                        </>
                }}
            >

                <Stack.Screen name={Screens.Dashboard} options={{ title: 'Dashboard' }} component={Dashboard} />

                <Stack.Screen name={Screens.Facilities} options={{ title: 'Facilities' }} component={Facilities} />
                <Stack.Screen name={Screens.FacilityForm} options={{ title: 'Facility Form' }} component={FacilityForm} />

                <Stack.Screen name={Screens.CompanyProfile} options={{ title: 'Profile' }} component={CompanyProfile} />
                <Stack.Screen name={Screens.CompanyProfileForm} options={{ title: 'Profile Form' }} component={CompanyProfileForm} />

                <Stack.Screen name={Screens.UserProfile} options={{ title: 'Profile' }} component={UserProfile} />
                <Stack.Screen name={Screens.UserProfileForm} options={{ title: 'Profile Form' }} component={UserProfileForm} />

                <Stack.Screen name={Screens.Calendar} options={{ title: 'Calendar' }} component={AgendaScreen} />
                <Stack.Screen name={Screens.About} options={{ title: 'About' }} component={About} />

            </Stack.Group>
        </Stack.Navigator>
    );
};

export default AppNavigator;
