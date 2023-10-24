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
import { Icon } from "react-native-elements";
import colors from "../../styles/colors";

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

        console.log(navigator.getState());
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
                        label="Tabs"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="home" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo('TabNavigator')}
                        style={styles.drawerItem}
                    />

                    <DrawerItem
                        label="Dashboard"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="dashboard" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo('Dashboard')}
                        style={styles.drawerItem}
                    />

                    <DrawerItem
                        label="Facilities"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="scoreboard" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo('Facilities')}
                        style={styles.drawerItem}
                    />

                    <DrawerItem
                        label="Profile"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="person-outline" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo(userData?.type == 'COMPANY_USER' ? 'CompanyProfile' : 'UserProfile')}
                        style={styles.drawerItem}
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
                        onPress={() => navigateTo('Calendar')}
                        style={styles.drawerItem}
                    />
                    <DrawerItem
                        label="About"
                        icon={({ focused, color, size }) => (
                            <Icon
                                name="info" // Replace with your desired icon name
                                type="material"
                                size={25}
                            />
                        )}
                        onPress={() => navigateTo('About')}
                        style={styles.drawerItem}
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
    drawerItem: {

    }
})