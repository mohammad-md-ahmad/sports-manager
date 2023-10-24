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

const Stack = createStackNavigator();

const AppNavigator = () => {

    const navigator = useNavigation();
    const route = useRoute();

    const [drawerIndex, setDrawerIndex] = useState(0);

    const toggleDrawer = () => {
        navigator.toggleDrawer();
    }

    useEffect(() => {
        const index = navigator.getState().routes[0].state?.index;
        setDrawerIndex(index ?? 0);
    }, [navigator.getState().routes[0].state?.index])

    const toggleBack = () => {
        navigator.goBack();
    }

    const toggleSearch = () => {

    }

    return (
        <Stack.Navigator>
            <Stack.Group
                screenOptions={{
                    headerStyle: { backgroundColor: colors.PrimaryGreen },
                    headerLeft: () =>
                        <>
                            {drawerIndex == 0 ?
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

                <Stack.Screen name="Dashboard" options={{ title: 'Dashboard' }} component={Dashboard} />

                <Stack.Screen name="Facilities" options={{ title: 'Facilities' }} component={Facilities} />
                <Stack.Screen name="FacilityForm" options={{ title: 'Facility Form' }} component={FacilityForm} />

                <Stack.Screen name="CompanyProfile" options={{ title: 'Profile' }} component={CompanyProfile} />
                <Stack.Screen name="CompanyProfileForm" options={{ title: 'Profile Form' }} component={CompanyProfileForm} />

                <Stack.Screen name="UserProfile" options={{ title: 'Profile' }} component={UserProfile} />
                <Stack.Screen name="UserProfileForm" options={{ title: 'Profile Form' }} component={UserProfileForm} />

                <Stack.Screen name="Calendar" options={{ title: 'Calendar' }} component={AgendaScreen} />
                <Stack.Screen name="About" options={{ title: 'About' }} component={About} />

            </Stack.Group>
        </Stack.Navigator>
    );
};

export default AppNavigator;
