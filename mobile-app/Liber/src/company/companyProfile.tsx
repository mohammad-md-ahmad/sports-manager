import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import globalStyles from '../../styles/styles';
import fonts from '../../styles/fonts';
import { Button } from 'react-native-elements';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';
import { getCompanyData } from '../../helpers/companyDataManage';
import CompanyService from '../../api/CompanyService';
import Constants, { GlobaSateKey, Screens, UserType } from '../../helpers/constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Facilities from '../facilities/facilities';
import AgendaScreen from '../calendar/calendar';
import Rating from '../rating/rating';
import CompanyDetails from './companyDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../helpers/userDataManage';

const Tab = createMaterialTopTabNavigator();

export default function CompanyProfile() {
    // Extract user information from the route parameters

    const navigator = useNavigation();
    const dispatch = useDispatch();

    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        logo: require('./../../assets/images/liber_logo.png')
    });

    function onEditPress(): void {
        navigator.navigate(Screens.CompanyProfileForm)
    }

    const companyService = new CompanyService();

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.

            getUserData().then((data: string | null) => {
                if (data !== null) {
                    let user = JSON.parse(data);
                    if (user?.type == UserType.CompanyUser) {
                        companyService.getCompany().then((response) => {
                            console.log('company data', response.data)
                            setCompanyData({ ...response.data.data, logo: { uri: response.data?.data?.logo } });
                            dispatch({ type: GlobaSateKey.SetCompanyData, payload: response.data.data });
                        }).catch((error) => {
                            console.error('company error', error)
                        });
                    } else {
                        setCompanyData(useSelector(state => state.companyData))
                    }
                }

            });

        }, [])
    );

    return (
        <>
            <View style={styles.container}>
                <Image source={companyData.logo} style={styles.logo} />
                <View>
                    <Text style={styles.name}>{companyData.name}</Text>
                    <Text style={styles.description}>{companyData.description}</Text>
                </View>
            </View >
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        borderBottomWidth: 3,
                        borderBottomColor: colors.PrimaryGreen,
                    },
                }}>
                <Tab.Screen name={Screens.CompanyDetails} options={{ title: 'Home' }} component={CompanyDetails} />
                <Tab.Screen name={Screens.Facilities} options={{ title: 'Booking' }} component={Facilities} />
                <Tab.Screen name={Screens.Calendar} options={{ title: 'Calendar' }} component={AgendaScreen} />
                <Tab.Screen name={Screens.Ratings} options={{ title: 'Rating' }} component={Rating} />
            </Tab.Navigator>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        flexDirection: 'row',
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        margin: 10,
        borderWidth: 0,
        resizeMode: 'contain',
    },
    name: {
        marginTop: 50,
        ...globalStyles.text,
        fontSize: 20,
        color: colors.PrimaryBlue,
    },
    description: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.medium,
        padding: 10,
        fontSize: 16,
        color: 'gray',
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        width: 100,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    },
    button: {
        ...globalStyles.button,
        width: 250,
    },
});

