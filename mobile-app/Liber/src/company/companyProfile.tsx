import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import globalStyles from '../../styles/styles';
import fonts from '../../styles/fonts';
import { Button } from 'react-native-elements';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';
import CompanyService from '../../api/CompanyService';
import { GlobaSateKey, Screens, UserType } from '../../helpers/constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Rating from '../rating/companyRating';
import CompanyDetails from './companyDetails';
import { useDispatch, useSelector } from 'react-redux';
import CompanyPhotos from './companyPhotos';
import RatingRowWithNumber from '../common/ratingRowWithNumber';
import CompanySurveyService from '../../api/CompanySurveyService';

const Tab = createMaterialTopTabNavigator();

export default function CompanyProfile() {
    // Extract user information from the route parameters

    const dispatch = useDispatch();

    const authCompanyData = useSelector(state => state.authCompanyData);

    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        logo: require('./../../assets/images/liber_logo.png')
    });

    const companySurveyService = new CompanySurveyService();
    function onSendSurveyPress(): void {
        companySurveyService.sendSurveyToUsers()
            .then(() => { })
            .catch(() => { })
    }

    const companyService = new CompanyService();

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.
            if (authCompanyData && authCompanyData.gallery) {
                setCompanyData(authCompanyData);
                dispatch({ type: GlobaSateKey.SetCompanyData, payload: authCompanyData });
            }
            else {
                companyService.getCompany().then((response) => {
                    setCompanyData({ ...response.data.data, logo: { uri: response.data?.data?.logo } });
                    dispatch({ type: GlobaSateKey.SetCompanyData, payload: { ...response?.data?.data, logo: { uri: response?.data?.data?.logo } } });
                }).catch((error) => {
                });
            }
        }, [])
    );

    return (
        <>
            <View style={styles.container}>
                <Image source={companyData.logo} style={styles.logo} />
                <Text style={styles.name}>{companyData.name}</Text>
                <RatingRowWithNumber ratingData={{ ratingNumber: companyData?.total_rating }} />
                <Button
                    onPress={() => onSendSurveyPress()}
                    title="Send Survey"
                    buttonStyle={styles.button}
                />
            </View >
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        borderBottomWidth: 3,
                        borderBottomColor: colors.PrimaryGreen,
                    },
                }}>
                <Tab.Screen name={Screens.CompanyDetails} options={{ title: 'Info' }} component={CompanyDetails} />
                <Tab.Screen name={Screens.CompanyPhotos} options={{ title: 'Photos' }} component={CompanyPhotos} />
                {/* <Tab.Screen name={Screens.Facilities} options={{ title: 'Booking' }} component={Facilities} />
                <Tab.Screen name={Screens.Calendar} options={{ title: 'Calendar' }} component={AgendaScreen} /> */}
                <Tab.Screen name={Screens.Ratings} options={{ title: 'Rating' }} component={Rating} />
            </Tab.Navigator>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
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
        width: 300,
        marginBottom: 15
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    ratingText: {
        fontSize: 16,
        color: colors.PrimaryBlue,
        marginEnd: 5,
    },
});
