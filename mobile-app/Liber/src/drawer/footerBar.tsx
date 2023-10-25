import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Screens } from '../../helpers/constants';


const FooterBar: React.FC = () => {
    const navigator = useNavigation();
    const dispatch = useDispatch();
    const currentScreen = useSelector(state => state.currentScreen);

    const navigateTo = (screen: string) => {

        navigator.navigate(screen);
        dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
    }

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
                style={[styles.button, currentScreen === Screens.CompanyProfile && styles.activeButton]}
                onPress={() => navigateTo(Screens.CompanyProfile)}
            >
                <Icon
                    name="person-outline" // Replace with your desired icon name
                    type="material"
                    size={25}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, currentScreen === Screens.Facilities && styles.activeButton]}
                onPress={() => navigateTo(Screens.Facilities)}
            >
                <Icon
                    name="star" // Replace with your desired icon name
                    type="material"
                    size={25}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, currentScreen === Screens.About && styles.activeButton]}
                onPress={() => navigateTo(Screens.About)}
            >
                <Icon
                    name="search" // Replace with your desired icon name
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
        marginHorizontal:5
    },
    activeButton: {
        backgroundColor: colors.PrimaryBlueLight,

    },
});

export default FooterBar;
