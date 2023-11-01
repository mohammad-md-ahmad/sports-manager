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
import { TouchableOpacity, View } from 'react-native';
import { Screens, UserType } from '../../helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import FacilityView from '../facilities/facilityView';
import { getUserData } from '../../helpers/userDataManage';

const Stack = createStackNavigator();

const AppNavigator = () => {

    const navigator = useNavigation();
    const dispatch = useDispatch();
    const currentScreen = useSelector(state => state.currentScreen);

    const toggleDrawer = () => {
        navigator.toggleDrawer();
    }

    const toggleBack = () => {

        navigator.goBack();
    }

    const toggleSearch = () => {

    }

    function onAddFacilityPress(): void {
        navigator.navigate(Screens.FacilityForm);
    }

    useEffect(() => {
        let routesStack = navigator.getState().routes[0].state?.routes ?? [{ name: Screens.Dashboard }];
        let screen = routesStack[routesStack?.length - 1].name ?? Screens.Dashboard;
        dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
    }, [navigator.getState().routes[0].state?.index])

    let content;
    switch (currentScreen) {
        case Screens.Facilities:
            content =
                <TouchableOpacity
                    onPress={() => onAddFacilityPress()}>
                    <View style={{ margin: 15 }}>
                        <Icon
                            name="add" // Replace with your desired icon name
                            type="material"
                            size={25}

                        />
                    </View>
                </TouchableOpacity>
            break;
        default:
            content =
                <TouchableOpacity
                    onPress={() => toggleSearch()}>
                    <View style={{ margin: 15 }}>
                        <Icon
                            name="search" // Replace with your desired icon name
                            type="material"
                            size={25}
                        />
                    </View>
                </TouchableOpacity>
    }

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
        });
    }, []);

    return (
        <Stack.Navigator>
            <Stack.Group
                screenOptions={{
                    //headerShown:false,
                    headerStyle: { backgroundColor: colors.PrimaryGreen },
                    headerLeft: () =>
                        <>
                            {currentScreen == Screens.Dashboard ?
                                <TouchableOpacity
                                    onPress={() => toggleDrawer()}>
                                    <View style={{ margin: 15 }}>
                                        <Icon
                                            name="menu" // Replace with your desired icon name
                                            type="material"
                                            size={25}
                                        />
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={() => toggleBack()}>
                                    <View style={{ margin: 15 }}>
                                        <Icon
                                            name="arrow-back" // Replace with your desired icon name
                                            type="material"
                                            size={25}
                                        />
                                    </View>
                                </TouchableOpacity>
                            }
                        </>
                    ,
                    headerRight: () =>
                        <>
                            {content}
                        </>
                }}
            >

                <Stack.Screen name={Screens.Dashboard} options={{ title: 'Dashboard' }} component={Dashboard} />

                <Stack.Screen name={Screens.Facilities} options={{ title: 'Facilities' }} component={Facilities} />
                <Stack.Screen name={Screens.FacilityForm} options={{ title: 'Facility Form' }} component={FacilityForm} />
                <Stack.Screen name={Screens.FacilityView} options={{ title: 'Facility View' }} component={FacilityView} />

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
