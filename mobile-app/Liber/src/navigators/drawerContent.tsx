import React, { useEffect, useState } from "react";

import {
    Image,
    View,
    ScrollView,
    StyleSheet,
} from "react-native";
import globalStyles from "../../styles/styles";
import { DrawerItem } from "@react-navigation/drawer";
import { useAuth } from "../../AuhtContext";
import AuthService from "../../api/AuthService";
import BaseComponent from "../common/baseComponent";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "../../helpers/userDataManage";
import { Icon } from "react-native-elements";
import { GlobaSateKey, Screens, UserType } from "../../helpers/constants";
import colors from "../../styles/colors";
import { useDispatch, useSelector } from "react-redux";

export default function DrawerContent(props: any): React.JSX.Element {
    const { logout } = useAuth();
    const authService = new AuthService();
    const navigator = useNavigation();
    const dispatch = useDispatch();
    const currentScreen = useSelector(state => state.currentScreen);

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
        dispatch({ type: GlobaSateKey.SetCurrentScreen, payload: screen });
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
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="dashboard" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo(Screens.Dashboard)}
                        style={currentScreen === Screens.Dashboard && styles.activeDrawerItem}
                    />

                    {userData?.type == UserType.CompanyUser ?
                        <DrawerItem
                            label="Program Managment"
                            icon={({ focused, color, size }) => (
                                <Icon
                                    name="scoreboard" // Replace with your desired icon name
                                    type="material"
                                    size={25}
                                />
                            )}
                            onPress={() => navigateTo(Screens.ProgramManagmentTabs)}
                            style={currentScreen === Screens.ProgramManagmentTabs && styles.activeDrawerItem}
                        /> : <></>
                    }

                    <DrawerItem
                        label="Profile"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="person-outline" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo(userData?.type == UserType.CompanyUser ? Screens.CompanyProfile : Screens.UserProfile)}
                        style={currentScreen === (userData?.type == UserType.CompanyUser ? Screens.CompanyProfile : Screens.UserProfile) && styles.activeDrawerItem}
                    />

                    <DrawerItem
                        label="Calendar"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="calendar-month" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo(Screens.Calendar)}
                        style={currentScreen === Screens.Calendar && styles.activeDrawerItem}
                    />

                    {userData?.type == UserType.CustomerUser ?
                        <DrawerItem
                            label="Booking"
                            icon={({ focused, color, size }) => (
                                <Icon
                                    name="scoreboard" // Replace with your desired icon name
                                    type="material"
                                    size={25}
                                />
                            )}
                            onPress={() => navigateTo(Screens.UserBooking)}
                            style={currentScreen === Screens.UserBooking && styles.activeDrawerItem}
                        /> : <></>
                    }

                    <DrawerItem
                        label="About"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="info" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo(Screens.About)}
                        style={currentScreen === Screens.About && styles.activeDrawerItem}
                    />

                    <DrawerItem
                        label="Facilities"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="info" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo(Screens.Facilities)}
                        style={currentScreen === Screens.Facilities && styles.activeDrawerItem}
                    />
                </ScrollView>
                <DrawerItem
                    label="Logout"
                    icon={({ focused, color, size }) => (
                        <Icon
                            name="logout" // Replace with your desired icon name
                            type="material"
                            size={25}
                        />
                    )}
                    onPress={() => onLogoutPress()}
                    style={{ bottom: 0 }}
                />
            </View>
        </BaseComponent>
    );
}

const styles = StyleSheet.create({
    activeDrawerItem: {
        backgroundColor: colors.PrimaryBlueLight
    }
})