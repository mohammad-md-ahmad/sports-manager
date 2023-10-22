import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import globalStyles from '../../styles/styles';
import fonts from '../../styles/fonts';
import { Button } from 'react-native-elements';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';
import { getCompanyData } from '../../helpers/companyDataManage';
import CompanyService from '../../api/CompanyService';
import Constants from '../../helpers/constants';

export default function CompanyProfile() {
    // Extract user information from the route parameters

    const navigator = useNavigation();

    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        logo: require('./../../assets/images/liber_logo.png')
    });

    function onEditPress(): void {
        navigator.navigate('CompanyProfileForm')
    }

    const companyService = new CompanyService();

    useFocusEffect(
        React.useCallback(() => {
            // This code will execute when the component gains focus (navigated to).
            // You can put the logic here that you want to run when the component should reload.


            companyService.getCompany().then((response) => {
                console.log('company data', response.data)
                setCompanyData({ ...response.data.data, logo: { uri: response.data?.data?.logo } });
            }).catch((error) => {
                console.error('company error', error)
            });

            // getCompanyData().then((data: string | null) => {
            //     if (data !== null) {
            //         let parsedData = JSON.parse(data);
            //         console.log('parsedData-------', parsedData)

            //         if (parsedData.logo == null)
            //             parsedData.logo = require('./../../assets/images/liber_logo.png');

            //         setCompanyData({ ...parsedData });
            //     }
            // });
        }, [])
    );

    return (
        <View style={styles.container}>
            <Image source={companyData.logo} style={styles.logo} />

            <Text style={styles.name}>{companyData.name}</Text>
            <Text style={styles.description}>{companyData.description}</Text>

            <Button
                onPress={() => onEditPress()}
                title="Edit"
                buttonStyle={styles.button}
            />

            {/* Add more fields as needed */}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        marginTop: 10,
        borderWidth: 0,
        resizeMode: 'contain',
    },
    name: {
        ...globalStyles.text,
        fontSize: 20,
        marginBottom: 5,
        color: colors.PrimaryBlue,
    },
    description: {
        ...globalStyles.text,
        fontFamily: fonts.Poppins.medium,
        padding: 10,
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
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

