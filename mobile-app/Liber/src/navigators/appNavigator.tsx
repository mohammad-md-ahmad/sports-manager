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
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FormMode, GlobaSateKey, NotificationActionButtons, Screens, UserType } from '../../helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import FacilityView from '../facilities/facilityView';
import { getUserData } from '../../helpers/userDataManage';
import ScheduleForm from '../schedule/scheduleForm';
import Search from '../search/search';
import UserBooking from '../booking/userBooking';
import { OneSignal } from 'react-native-onesignal';
import programManagmentTabs from './programManagmentTabs';
import BaseComponent from '../common/baseComponent';
import CompanyView from '../company/companyView';
import ProfileMenu from './profileMenu';
import ScheduleEditForm from '../schedule/scheduleEditForm';
import UsersList from '../user/usersList';
import PaymentMethodsForm from '../payments/paymentMethodsForm';
import BookingHistoryList from '../booking/bookingHistoryList';
import UserBookingHistoryList from '../booking/userBookingHistoryList';
import UserView from '../user/userView';
import SurviesList from '../survey/surviesList';
import SurveyForm from '../survey/surveyForm';
import SurveyFillForm from '../survey/surveyFillForm';
import BookingService from '../../api/BookingService';

const Stack = createStackNavigator();

const AppNavigator = () => {

    const navigator = useNavigation();
    const dispatch = useDispatch();
    const currentScreen = useSelector(state => state.currentScreen);

    const bookingService = new BookingService();

    useEffect(() => {
        // Method for listening for notification clicks
        OneSignal.Notifications.addEventListener('click', pushNotificationClicked);

        // Clean up event listener when component unmounts
        return () => {
            OneSignal.Notifications.removeEventListener('click', pushNotificationClicked);
        };
    }, []);

    const pushNotificationClicked = (event) => {
        console.log('OneSignal: notification clicked:', event);

        if (event.result) {
            if (event.result?.actionId) {
                let actionId = event.result?.actionId;

                switch (actionId) {
                    case NotificationActionButtons.ApproveBookingBtn:
                        approveBooking(event.notification?.additionalData?.booking_uuid);
                        break;
                    case NotificationActionButtons.DeclineBookingBtn:
                        declineBooking(event.notification?.additionalData?.booking_uuid)
                        break;
                    default:
                        let screen = event.notification?.additionalData?.screen
                        navigator.navigate(screen);
                        break;
                }

            } else if (event.notification?.additionalData) {
                let screen = event.notification?.additionalData?.screen
                navigator.navigate(screen);
            }
        }
    };

    const approveBooking = (bookingUuid: string): void => {
        bookingService.bookApprove({ uuid: bookingUuid })
            .then((response) => {
            }).catch((error) => {
            }).finally(() => {
            })
    }

    const declineBooking = (bookingUuid: string): void => {
        bookingService.bookDecline({ uuid: bookingUuid })
            .then((response) => {
            }).catch((error) => {
            }).finally(() => {
            })
    }

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
        navigator.navigate(Screens.FacilityForm, {
            'formModeParam': FormMode.Add,
        });
    }

    function onEditFacilityPress(): void {
        let routes = navigator.getState().routes;
        let { facility } = routes[routes.length - 1].params;

        navigator.navigate(Screens.FacilityForm, {
            'formModeParam': FormMode.Edit,
            'facilityParam': facility,
        });
    }

    function onAddSurveyPress(): void {
        navigator.navigate(Screens.SurveyForm);
    }

    function onScheduleFormPress(): void {
        let routes = navigator.getState().routes;
        let { facility } = routes[routes.length - 1].params;

        navigator.navigate(Screens.ScheduleForm, { "facility": facility });
    }

    function onCalendarViewPress(): void {
        let routes = navigator.getState().routes;
        let { facility } = routes[routes.length - 1].params;

        navigator.navigate(Screens.Calendar, { "facility": facility });
    }

    function onEditComapnyPress(): void {
        navigator.navigate(Screens.CompanyProfileForm);
    }

    function onEditUserPress(): void {
        navigator.navigate(Screens.UserProfileForm);
    }

    useEffect(() => {
        const unsubscribe = navigator.addListener('state', () => {
            // This function will be called when the navigation state changes
            const { index, routes } = navigator.getState();
            dispatch({ type: GlobaSateKey.SetCurrentScreen, payload: routes[index].name });
        });

        // Clean up the subscription when the component is unmounted
        return unsubscribe;
    }, [navigator]);

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
        if (userData.type)
            if (userData.type == UserType.CompanyUser) {
                switch (currentScreen) {
                    case Screens.CompanyProfile:
                        setContent(
                            <TouchableOpacity
                                onPress={() => onEditComapnyPress()}>
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
                    case Screens.SurviesList:
                        setContent(
                            <TouchableOpacity
                                onPress={() => onAddSurveyPress()}>
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
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    onPress={() => onScheduleFormPress()}>
                                    <View style={{ margin: 15 }}>
                                        <Icon
                                            name="edit-calendar" // Replace with your desired icon name
                                            type="material"
                                            size={25}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onEditFacilityPress()}>
                                    <View style={{ margin: 15 }}>
                                        <Icon
                                            name="edit" // Replace with your desired icon name
                                            type="material"
                                            size={25}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                        break;
                    default:
                        setContent(<></>)
                }
            } else {
                switch (currentScreen) {
                    case Screens.UserProfile:
                        setContent(
                            <TouchableOpacity
                                onPress={() => onEditUserPress()}>
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
            } else {
            setContent(<></>)
        }

    }, [userData, currentScreen])

    return (
        <BaseComponent>
            <Stack.Navigator>
                <Stack.Group
                    screenOptions={{
                        //headerShown:false,
                        headerStyle: { backgroundColor: colors.PrimaryGreen },

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
                    <Stack.Screen name={Screens.ScheduleEditForm} options={{ title: 'Schedule Form' }} component={ScheduleEditForm} />

                    <Stack.Screen name={Screens.CompanyProfile} options={{ title: 'Profile' }} component={CompanyProfile} />
                    <Stack.Screen name={Screens.CompanyProfileForm} options={{ title: 'Profile Form' }} component={CompanyProfileForm} />
                    <Stack.Screen name={Screens.CompanyView} options={{ title: 'Company View' }} component={CompanyView} />

                    <Stack.Screen name={Screens.ProfileMenu} options={{ title: 'Menu' }} component={ProfileMenu} />

                    <Stack.Screen name={Screens.UserProfile} options={{ title: 'Profile' }} component={UserProfile} />
                    <Stack.Screen name={Screens.UserView} options={{ title: 'User View' }} component={UserView} />
                    <Stack.Screen name={Screens.UserProfileForm} options={{ title: 'Profile Form' }} component={UserProfileForm} />

                    <Stack.Screen name={Screens.UsersList} options={{ title: 'Users' }} component={UsersList} />

                    <Stack.Screen name={Screens.PaymentMethodsForm} options={{ title: 'Payment Methods' }} component={PaymentMethodsForm} />

                    <Stack.Screen name={Screens.Calendar} options={{ title: 'Calendar' }} component={AgendaScreen} />
                    <Stack.Screen name={Screens.Search} options={{ title: 'Search' }} component={Search} />

                    <Stack.Screen name={Screens.UserBooking} options={{ title: 'User Booking' }} component={UserBooking} />
                    <Stack.Screen name={Screens.BookingHistoryList} options={{ title: 'Booking History' }} component={BookingHistoryList} />
                    <Stack.Screen name={Screens.UserBookingHistoryList} options={{ title: 'Booking History' }} component={UserBookingHistoryList} />

                    <Stack.Screen name={Screens.ProgramManagmentTabs} options={{ title: 'Program Managment' }} component={programManagmentTabs} />

                    <Stack.Screen name={Screens.SurviesList} options={{ title: 'Survies List' }} component={SurviesList} />
                    <Stack.Screen name={Screens.SurveyForm} options={{ title: 'Survey Form' }} component={SurveyForm} />
                    {/*<Stack.Screen name={Screens.SurveyFillForm} options={{ title: 'Fill Survey Form' }} component={SurveyFillForm} />*/}


                    <Stack.Screen name={Screens.About} options={{ title: 'About' }} component={About} />

                </Stack.Group>
            </Stack.Navigator>
        </BaseComponent>
    );
};

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Adjust this to control the spacing between buttons
        alignItems: 'center',
    },
})

export default AppNavigator;


