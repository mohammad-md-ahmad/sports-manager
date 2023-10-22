import React from "react";

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

export default function DrawerContent(props: any): React.JSX.Element {
    const { logout } = useAuth();
    const authService = new AuthService();

    const onLoginPress = () => {
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
                    <DrawerItemList {...props} />

                </ScrollView>
                <DrawerItem
                    label="Logout"
                    onPress={() => onLoginPress()}
                    style={{ bottom: 0 }}
                />
            </View>
        </BaseComponent>
    );
}