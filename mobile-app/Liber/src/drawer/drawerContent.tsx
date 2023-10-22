import React, { useEffect, useState } from "react";

import {
    Image,
    View,
    ScrollView,
    StyleSheet,
} from "react-native";
import globalStyles from "../../styles/styles";
import { DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "../../AuhtContext";
import AuthService from "../../api/AuthService";
import BaseComponent from "../common/baseComponent";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "../../helpers/userDataManage";

export default function DrawerContent(props: any): React.JSX.Element {
    const { logout } = useAuth();
    const authService = new AuthService();
    const navigator = useNavigation();

    const onLogoutPress = () => {
        authService.logout().then((response) => {
            // Handle a successful API response
            logout();

        }).catch((error) => {
            // Handle API request errors here
            console.error('Error logout:', error);
        }).finally(() => {
            logout();
        });
    };

    const navigateTo = (screen: string) => {
        navigator.navigate(screen);
    }

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
        });
    }, []);

    return (
        <BaseComponent>
            <View style={globalStyles.drawerContainer} >
                <View style={globalStyles.drawerImageConatiner} >
                    <Image
                        source={require('./../../assets/images/liber_logo.png')}
                        style={globalStyles.headerImage}
                    />
                </View>
                <ScrollView>
                    {/* <DrawerItemList {...props} /> */}
                    <DrawerItem
                        label="Dashboard"
                        onPress={() => navigateTo('Dashboard')}
                        style={{ bottom: 0 }}
                    />
                    <DrawerItem
                        label="Facilities"
                        onPress={() => navigateTo('Facilities')}
                        style={{ bottom: 0 }}
                    />

                    <DrawerItem
                        label="Profile"
                        onPress={() => navigateTo(userData?.type == 'COMPANY_USER' ? 'CompanyProfile' : 'UserProfile')}
                        style={{ bottom: 0 }}
                    />

                    <DrawerItem
                        label="Calendar"
                        onPress={() => navigateTo('Calendar')}
                        style={{ bottom: 0 }}
                    />
                    <DrawerItem
                        label="About"
                        onPress={() => navigateTo('About')}
                        style={{ bottom: 0 }}
                    />
                </ScrollView>
                <DrawerItem
                    label="Logout"
                    onPress={() => onLogoutPress()}
                    style={{ bottom: 0 }}
                />
            </View>
        </BaseComponent>
    );
}