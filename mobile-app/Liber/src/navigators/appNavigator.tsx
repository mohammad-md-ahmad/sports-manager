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
import ScheduleForm from '../schedule/scheduleForm';
import Search from '../search/search';
import UserBooking from '../booking/userBooking';
import { OneSignal } from 'react-native-onesignal';
import companyProfileTabs from './companyProfileTabs';
import programManagmentTabs from './programManagmentTabs';

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
        navigator.navigate(Screens.Search);
    }

    function onAddFacilityPress(): void {
        navigator.navigate(Screens.FacilityForm);
    }

    function onScheduleFormPress(): void {
        let routes = navigator.getState().routes[0].state.routes;
        let { facility } = routes[routes.length - 1].params;

        navigator.navigate(Screens.ScheduleForm, { "facility": facility });
    }

    function onCalendarViewPress(): void {
        let routes = navigator.getState().routes[0].state.routes;
        let { facility } = routes[routes.length - 1].params;

        navigator.navigate(Screens.Calendar, { "facility": facility });
    }

    useEffect(() => {
        let routesStack = navigator.getState().routes[0].state?.routes ?? [{ name: Screens.Dashboard }];
        let screen = routesStack[routesStack?.length - 1].name ?? Screens.Dashboard;
        dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
    }, [navigator.getState().routes[0].state?.index])
    
    useEffect(() => {
       console.log(navigator.getState());
        
    }, [navigator.getState()])

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
            if (data !== null) {
                let user = JSON.parse(data);
                OneSignal.User.addTags({ user_type: user.type });
            }

        });
    }, []);

    const [content, setContent] = useState(<></>);

    useEffect(() => {
        console.log("userData", userData)
        if (userData.type)
            if (userData.type == UserType.CompanyUser) {
                switch (currentScreen) {
                    case Screens.Facilities:
                        setContent(
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
                        )
                        break;
                    case Screens.FacilityView:
                        setContent(
                            <TouchableOpacity
                                onPress={() => onScheduleFormPress()}>
                                <View style={{ margin: 15 }}>
                                    <Icon
                                        name="edit" // Replace with your desired icon name
                                        type="material"
                                        size={25}

                                    />
                                </View>
                            </TouchableOpacity>
                        )
                        break;
                    default:
                        setContent(<></>)
                }
            } else {
                switch (currentScreen) {
                    case Screens.FacilityView:
                        setContent(
                            <TouchableOpacity
                                onPress={() => onCalendarViewPress()}>
                                <View style={{ margin: 15 }}>
                                    <Icon
                                        name="calendar-month" // Replace with your desired icon name
                                        type="material"
                                        size={25}

                                    />
                                </View>
                            </TouchableOpacity>
                        )
                        break;
                    default:
                        setContent(<></>)
                }
            }else{
                setContent(<></>)
            }

    }, [userData, currentScreen])

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

                <Stack.Screen name={Screens.ScheduleForm} options={{ title: 'Schedule Form' }} component={ScheduleForm} />

                <Stack.Screen name={Screens.companyProfileTabs} options={{ title: 'Profile' }} component={companyProfileTabs} />
                <Stack.Screen name={Screens.CompanyProfileForm} options={{ title: 'Profile Form' }} component={CompanyProfileForm} />

                <Stack.Screen name={Screens.UserProfile} options={{ title: 'Profile' }} component={UserProfile} />
                <Stack.Screen name={Screens.UserProfileForm} options={{ title: 'Profile Form' }} component={UserProfileForm} />

                <Stack.Screen name={Screens.Calendar} options={{ title: 'Calendar' }} component={AgendaScreen} />
                <Stack.Screen name={Screens.Search} options={{ title: 'Search' }} component={Search} />

                <Stack.Screen name={Screens.UserBooking} options={{ title: 'User Booking' }} component={UserBooking} />

                <Stack.Screen name={Screens.programManagmentTabs} options={{ title: 'Program Managment' }} component={programManagmentTabs} />


                <Stack.Screen name={Screens.About} options={{ title: 'About' }} component={About} />

            </Stack.Group>
        </Stack.Navigator>
    );
};

export default AppNavigator;