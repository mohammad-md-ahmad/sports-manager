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

export default function Content(props: any): React.JSX.Element {
    const { logout } = useAuth();
    const Drawer = createDrawerNavigator();

    return (
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
                onPress={() => logout()}
                style={{ bottom: 0 }}
            />
        </View>
    );
}