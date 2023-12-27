import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import globalStyles from '../../styles/styles';
import fonts from '../../styles/fonts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';
import UserService from '../../api/UserService';
import { Screens } from '../../helpers/constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BookingHistoryList from '../booking/bookingHistoryList';
import Notifications from '../notifications/notifications';

const Tab = createMaterialTopTabNavigator();

export default function UserProfile() {
    // Extract user information from the route parameters

    const navigator = useNavigation();

    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        profile_picture: require('./../../assets/images/liber_logo.png')
    })

    function onEditPress(): void {
        navigator.navigate(Screens.UserProfileForm)
    }

    const userService = new UserService();


    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            userService.getUser().then((response) => {
                setUserData({ ...response.data.data, profile_picture: { uri: response.data?.data?.profile_picture } });
            }).catch((error) => {
                console.error('user error', error)
            });
        }, [])
    );

    return (
        <>
            <View style={styles.container}>
                <Image source={userData.profile_picture} style={styles.logo} />

                <Text style={styles.name}>{userData.first_name + ' ' + userData.last_name}</Text>
                <Text style={styles.username}>{userData.username}</Text>
                <Text style={styles.email}>{userData.email}</Text>

                {/* Add more fields as needed */}
            </View >
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        borderBottomWidth: 3,
                        borderBottomColor: colors.PrimaryGreen,
                    },
                }}>
                <Tab.Screen name={Screens.BookingHistoryList} options={{ title: 'Booking History' }} component={BookingHistoryList} />
                <Tab.Screen name={Screens.Notifications} options={{ title: 'Notifications' }} component={Notifications} />
            </Tab.Navigator>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        marginTop: 10,
        borderWidth: 0,
        resizeMode: 'contain',
    },
    name: {
        ...globalStyles.text,
        fontSize: 20,
        color: colors.Gray,
    }, username: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.medium,
        fontSize: 18,
        color: colors.Gray,
    },
    email: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.regular,
        fontSize: 16,
        color: colors.Gray,
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        width: 100,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    },
    button: {
        ...globalStyles.button,
        width: 250,
    },
});

