import React from "react";

import {
    Keyboard,
    KeyboardAvoidingView,
    Text,
    Button,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    View,
    ScrollView,
} from "react-native";
import styles from "../../styles/styles";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "../dashboard/dashboard";
import LoginScreen from "../login/login";

export default function Content(props, { navigation }): React.JSX.Element {
    const onLoginPress = () => {
        navigation.navigate('Dashboard');
    };

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
            </ScrollView>
        </View>
    );
}
