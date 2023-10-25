// StackNavigator.tsx
import React, { useEffect, useState } from 'react';
import colors from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './drawerContent';
import AppNavigator from './appNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

    // const navigator = useNavigation();

    // const toggleBack = () => {
    //     navigator.goBack();
    // }

    const toggleSearch = () => {

    }

    return (
        <Drawer.Navigator

            drawerContent={(props) => <DrawerContent {...props} />}
            initialRouteName="AppNavigator"
        >
            <Drawer.Group
                screenOptions={{
                    headerShown: false,
                    // headerStyle: { backgroundColor: colors.PrimaryGreen },
                    // headerRight: () =>
                    //     <>

                    //         <View style={{ margin: 15 }}>
                    //             <Icon
                    //                 name="arrow-back" // Replace with your desired icon name
                    //                 type="material"
                    //                 size={25}
                    //                 onPress={() => toggleBack()}
                    //             />
                    //         </View>

                    //     </>
                }}
            >
                <Drawer.Screen name="AppNavigator" component={AppNavigator} />
            </Drawer.Group>
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;







