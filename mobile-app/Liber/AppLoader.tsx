
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
import { storeCountries } from './helpers/CountriesDataManage';
import LoginScreen from './src/login/login';
import Signup from './src/login/signup';
import About from './src/about/about';
import DrawerContent from './src/drawer/drawerContent';
import CompanyProfile from './src/company/companyProfile';
import CompanyProfileForm from './src/company/companyProfileForm';
import UserProfile from './src/user/userProfile';
import UserProfileForm from './src/user/userProfileForm';
import Dashboard from './src/dashboard/dashboard';
import Facilities from './src/facilities/facilities';
import FacilityForm from './src/facilities/facilityForm';
import colors from './styles/colors';



function AppLoader(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };

    const miscService = new MiscService();

    const Drawer = createDrawerNavigator();
    const Stack = createStackNavigator();
    const { isAuthenticated } = useAuth();

    const ProfileStack = createStackNavigator();
    const FacilitiesStack = createStackNavigator();
    const DashboardStack = createStackNavigator();

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
        });
    }, []);

    useEffect(() => {
        miscService.lists().then((response) => {
            storeFacilityTypes(response.data?.data?.facility_types);
            storeCountries(response.data?.data?.countries);
            console.log(response.data?.data);
        }).catch((error) => {

        });
    }, []);

    function ProfileNavigation() {

        if (userData?.type == 'COMPANY_USER')
            return (
                <ProfileStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
                    <ProfileStack.Screen name="CompanyProfile" options={{ title: 'Profile' }} component={CompanyProfile} />
                    <ProfileStack.Screen name="CompanyProfileForm" options={{ title: 'Profile Form' }} component={CompanyProfileForm} />
                </ProfileStack.Navigator>
            );
        else
            return (
                <ProfileStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
                    <ProfileStack.Screen name="UserProfile" options={{ title: 'Profile' }} component={UserProfile} />
                    <ProfileStack.Screen name="UserProfileForm" options={{ title: 'Profile Form' }} component={UserProfileForm} />
                </ProfileStack.Navigator>
            );
    }

    function DashboardNavigation() {

        if (userData?.type == 'COMPANY_USER')
            return (
                <DashboardStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
                    <DashboardStack.Screen name="CompanyDashboard" options={{ title: 'Company Dashboard' }} component={Dashboard} />
                </DashboardStack.Navigator>
            );
        else
            return (
                <DashboardStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
                    <DashboardStack.Screen name="CustomerDashboard" options={{ title: 'Customer Dashboard' }} component={Dashboard} />
                </DashboardStack.Navigator>
            );
    }

    function FacilitiesNavigation() {
        return (
            <FacilitiesStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Facilities">
                <FacilitiesStack.Screen name="Facilities" options={{ title: 'Facilities' }} component={Facilities} />
                <FacilitiesStack.Screen name="FacilityForm" options={{ title: 'Facility Form' }} component={FacilityForm} />
            </FacilitiesStack.Navigator>
        );
    }

    return (
        <NavigationContainer>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            {isAuthenticated ?
                <Drawer.Navigator
                    drawerContent={(props) => <DrawerContent {...props} />}
                    initialRouteName="Dashboard">
                    <Drawer.Group
                        screenOptions={{ headerStyle: { backgroundColor: colors.PrimaryGreen } }}>

                        <Drawer.Screen name="Dashboard" options={{ title: 'Dashboard' }} component={DashboardNavigation} />
                        <Drawer.Screen name="ProfileNavigation" options={{ title: 'Profile' }} component={ProfileNavigation} />
                        <Drawer.Screen name="FacilitiesNavigation" options={{ title: 'Facilities' }} component={FacilitiesNavigation} />

                        <Drawer.Group
                        // screenOptions={({ navigation }) => ({
                        //     presentation: 'modal',
                        //     headerLeft: () => <Icon
                        //         name="arrow-left" // Replace with your desired icon name
                        //         type="font-awesome"
                        //         size={30}
                        //         color={colors.PrimaryBlue}
                        //         onPress={navigation.goBack}
                        //     />
                        // })}
                        >
                            <Drawer.Screen name="About" options={{ title: 'About' }} component={About} />
                        </Drawer.Group>
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
