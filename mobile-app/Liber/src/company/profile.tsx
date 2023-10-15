import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import globalStyles from '../../styles/styles';
import fonts from '../../styles/fonts';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

function Profile() {
    // Extract user information from the route parameters

    const navigator = useNavigation();

    let companyData = {
        name: 'Liber Co',
        description: 'Liber Co is a company for booking facilities Liber Co is a company for booking facilities Liber Co is a company for booking facilities',
        logo: require('./../../assets/images/liber_logo.png')
    }

    function onEditPress(): void {
        navigator.navigate('ProfileForm')
    }

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
        borderWidth: 0,
        resizeMode: 'contain',
    },
    name: {
        ...globalStyles.text,
        fontSize: 20,
        marginBottom: 5,
        color: 'gray',
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

export default Profile;
