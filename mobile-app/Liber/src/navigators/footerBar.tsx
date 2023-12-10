import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Screens, UserType } from '../../helpers/constants';
import { getUserData } from '../../helpers/userDataManage';


const FooterBar: React.FC = () => {
    const navigator = useNavigation();
    const dispatch = useDispatch();
    const currentScreen = useSelector(state => state.currentScreen);

    const navigateTo = (screen: string) => {

        navigator.navigate(screen);
        dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
    }

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData().then((data: string | null) => {
            setUserData(data === null ? null : JSON.parse(data));
        });
    }, []);


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, currentScreen === Screens.Dashboard && styles.activeButton]}
                onPress={() => navigateTo(Screens.Dashboard)}
            >
                <Icon
                    name="home" // Replace with your desired icon name
                    type="material"
                    size={25}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, (currentScreen === Screens.ProgramManagmentTabs || currentScreen === Screens.UserBooking) && styles.activeButton]}
                onPress={() => navigateTo(userData?.type == UserType.CompanyUser ? Screens.ProgramManagmentTabs : Screens.UserBooking)}
            >
                <Icon
                    name="star" // Replace with your desired icon name
                    type="material"
                    size={25}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, currentScreen === Screens.Search && styles.activeButton]}
                onPress={() => navigateTo(Screens.Search)}
            >
                <Icon
                    name="search" // Replace with your desired icon name
                    type="material"
                    size={25}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, (currentScreen === Screens.CompanyProfile || currentScreen === Screens.UserProfile) && styles.activeButton]}
                onPress={() => navigateTo(userData?.type == UserType.CompanyUser ? Screens.CompanyProfile : Screens.UserProfile)}
            >
                <Icon
                    name="person-outline" // Replace with your desired icon name
                    type="material"
                    size={25}
                />
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.PrimaryGreen,
        justifyContent: 'space-around',
        paddingVertical: 10,
        height: 60,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        padding: 7,
        borderRadius: 20,
        marginHorizontal: 5
    },
    activeButton: {
        backgroundColor: colors.PrimaryBlueLight,

    },
});

export default FooterBar;
