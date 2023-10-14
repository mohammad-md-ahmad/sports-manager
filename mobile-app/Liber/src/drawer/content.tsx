import React from "react";

import {
    Image,
    View,
    ScrollView,
} from "react-native";
import styles from "../../styles/styles";
import { DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "../../AuhtContext";

export default function Content(props: any): React.JSX.Element {
    const { logout } = useAuth();
    const Drawer = createDrawerNavigator();

    return (
        <View style={styles.drawerContainer} >
            <View style={styles.drawerImageConatiner} >
                <Image
                    source={require('./../../assets/images/liber_logo.png')}
                    style={styles.headerImage}
                />
            </View>
            <ScrollView>
                <DrawerItemList {...props} />
                <DrawerItem
                    label="Logout"
                    onPress={() => logout()}
                />
            </ScrollView>

        </View>
    );
}
