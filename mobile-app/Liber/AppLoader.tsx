
import React from 'react';
import {
    StatusBar,
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
import Loader from './src/common/loader';
import { useLoading } from './LoadingContext';
import Profile from './src/company/profile';
import ProfileForm from './src/company/profileForm';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './src/login/signup';
import Facilities from './src/facilities/facilities';
import FacilityForm from './src/facilities/facilityForm';

function AppLoader(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };

    const Drawer = createDrawerNavigator();
    const Stack = createStackNavigator();
    const { isAuthenticated } = useAuth();
    const { loading } = useLoading();

    const ProfileStack = createStackNavigator();
    const FacilitiesStack = createStackNavigator();

    function ProfileNavigation() {
        return (
            <ProfileStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
                <ProfileStack.Screen name="Profile" options={{ title: 'Profile' }} component={Profile} />
                <ProfileStack.Screen name="ProfileForm" options={{ title: 'Profile Form' }} component={ProfileForm} />
            </ProfileStack.Navigator>
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
            <Loader loading={loading} />
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
                        <Drawer.Screen name="ProfileNavigation" options={{ title: 'Profile' }} component={ProfileNavigation} />
                        <Drawer.Screen name="FacilitiesNavigation" options={{ title: 'Facilities' }} component={FacilitiesNavigation} />

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
