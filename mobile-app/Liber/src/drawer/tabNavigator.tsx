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

const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => {

    return (
        <Tab.Navigator
            initialRouteName="AppNavigator"
            activeColor={colors.PrimaryBlue}
            inactiveColor={colors.PrimaryGreenLight}
            barStyle={{ backgroundColor: colors.PrimaryGreen, height: 60 }}
        >
            <Tab.Group
            >

                <Tab.Screen name="AppNavigator"
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ color }) => (
                            <Icon
                                name="home" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        ),
                    }}
                    component={Dashboard} />

                <Tab.Screen name="AppNavigator2"
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ color }) => (
                            <Icon
                                name="person-outline" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        ),
                    }}
                    component={CompanyProfile} />

                <Tab.Screen name="AppNavigator3"
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ color }) => (
                            <Icon
                                name="star" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        ),
                    }}
                    component={Facilities} />

                <Tab.Screen name="AppNavigator4"
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ color }) => (
                            <Icon
                                name="search" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        ),
                    }}
                    component={About} />


            </Tab.Group>
        </Tab.Navigator>
    );
};

export default TabNavigator;
